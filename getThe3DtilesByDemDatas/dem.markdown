
### 01首先将dem数据进行拼接

#### 方法1通过ArcGIS进行dem拼接
<img src="./pic/dem01.png">
<b>注意图像的位数可以再属性表的source里面查看<br></b>

#### 方法2通过ENVI进行dem拼接

<img src="./pic/dem02.png">
<img src="./pic/dem03.png">

<img src="./pic/dem04.png">
<b>SaveAs保存为tiff<br></b>

### 02对数据进行裁切和制作地形切片
<img src="./pic/dem05.png">
<b>EXECTBYMASK获取矢量面裁切过后的dem数据<br></b>

<img src="./pic/dem06.png">

### 03最后加载进cesium中地形情况
<img src="./pic/dem07.png">
<img src="./pic/dem08.png">