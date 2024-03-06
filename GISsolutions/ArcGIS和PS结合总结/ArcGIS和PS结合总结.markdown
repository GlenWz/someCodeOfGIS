## 背景：
PS 绘制过后的栅格数据进行影像切片 <br>
技术难点：1、坐标。2、颜色差异。 <br>

提供坐标和投影分别为WGS84-UTM投影的影像<br>
<img src="./img/pic01.PNG">

返回的数据分为两种情况，有坐标和没坐标的<br>
<b>有坐标的影像偏黑，具体什么原因，有可能是栅格影像中的某个数据导致，有可能是PS那边的数据没有处理好。</b> <br>
<img src="./img/pic02.PNG">
<b>无正常坐标的数据需要进行地图配准。<b><br>
<img src="./img/pic03.PNG">
<b>颜色的问题通过Catalog中右键栅格数据集，然后General->SourceType->Processed。进行更改<b><br>
<img src="./img/pic06.PNG">

#### 1.0 步骤一 对数据进行地图配准
进行地理配准（栅格叫做地理配准，矢量用的是空间矫正）<br>
<b>注意：地理配准中直接选择Recify将配准过后的影像直接另存为<br></b>
<img src="./img/pic06.PNG">

#### 2.0 步骤二 对配准数据进行投影以及转换
PS给的数据是16BIT，但是后面切图8Bit的数据才切得出来瓦片。<br>
<b>右键栅格数据输出，16bit转8bit unsigned integer->然后定义投影</b>
<img src="./img/pic07.PNG">
<img src="./img/pic08.PNG">
<b>8bit现在Processed显示正常，16bit的影像切出来影像全是黑色的</b>
<img src="./img/pic09.PNG">

#### 3.0 步骤三 进行切片输出结果
选择UTM投影->散列
<img src="./img/pic10.PNG">




