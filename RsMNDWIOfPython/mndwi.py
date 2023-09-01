import numpy as np

from osgeo import gdal

def readTiff(file):
    dataset=gdal.Open(file)
    img_bands=dataset.RasterCount
    img_width=dataset.RasterXSize
    img_height=dataset.RasterYSize
    img_data=dataset.ReadAsArray(0,0,img_width,img_height)
    return dataset,img_data

# 公式：（R绿-R中）/（R绿+R中）
def mndwi(green,midRead,img_data):
    green_band=img_data[green]
    mid_red_band=img_data[midRead]
    green_band,mid_red_band=green_band.astype(np.float),mid_red_band.astype(np.float)
    sub=green_band-mid_red_band
    add=green_band+mid_red_band
    mndwi_data=np.divide(sub,add,out=np.zeros_like(sub),where=add!=0)
    return mndwi_data

def writeTiff(dataset,img_data,filePath):
    img_proj=dataset.GetProjection()
    img_geo=dataset.GetGeoTransform()

    if len(img_data)==3:
        img_bands,img_height,img_width=img_data.shape
    else:
        img_height, img_width = img_data.shape
        img_bands=1
    driver= gdal.GetDriverByName("GTiff")
    new_dataset= driver.Create(filePath,img_width,img_height,img_bands,gdal.GDT_Float64)

    if new_dataset!=None:
        new_dataset.SetGeoTransform(img_geo)
        new_dataset.SetProjection(img_proj)
    if img_bands==1:
        new_dataset.GetRasterBand(1).WriteArray(img_data)
    else:
        for i in range(img_bands):
            new_dataset.GetRasterBand(i+1).WriteArray(img_data[i])
    del dataset

if __name__=="__main__":
    dataset,img_data= readTiff("./data/preData/preLake.tif")
    mndwi_data= mndwi(2,5,img_data)
    writeTiff(dataset,mndwi_data,"./data/preData/preLake_mndwi.tif")