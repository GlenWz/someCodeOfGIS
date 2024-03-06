## 背景：
需要将矢量的行政区范围在栅格影像上标注出来，输出成同一个栅格影像 <br>
<img src="./img/pic01.PNG">

#### 1.0步骤一 将矢量数据栅格化

<b>数据预处理定义投影坐标跳过，此遥感影像为GK投影，然后大地2000坐标系，忘记转了（cesium切片要UTM投影），文章已写完，将就看吧 <br></b>
<b>Conversion Tools->To Raster->Feature to Raster <br></b>

#### 2.0步骤二 行政区域单波段转多波段
影像有4个波段，栅格化的行政区域只有一个波段。<br>
<img src="./img/pic02.PNG">
<b>Data Management Tools->Raster->Raster Processing->composite Bands<br></b>

#### 3.0步骤三 行政区域单波段融进行融合

<img src="./img/pic03.PNG">
<b>Data Management Tools->Raster->Raster Dataset->Mosaic To New Raster<br></b>
<img src="./img/pic04.PNG">

#### 4.0 输出结果

<img src="./img/pic05.PNG">