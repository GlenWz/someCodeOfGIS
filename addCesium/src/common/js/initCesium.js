import { CesiumIonDefaultAccessToken, TianDiTuToken } from './config'

export function initCesium(Cesium) {
  // 使用Cesium官方示例中的Token
  Cesium.Ion.defaultAccessToken = CesiumIonDefaultAccessToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2YmRiNjM4MC1kMDZkLTQ2NDQtYjQ3My0xZDI4MDU0MGJhZDciLCJpZCI6MzIxMzAsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTY1MjM4NzZ9.A3FBZ6HjKkTsOGnjwWWeO9L10HQ9c-wcF4c3dtTc4gQ'
  return new Cesium.Viewer('cesiumContainer', {
    shouldAnimate: true,
    animation: false, // 是否创建动画小器件，左下角仪表
    baseLayerPicker: false, // 是否显示图层选择器
    fullscreenButton: false, // 是否显示全屏按钮
    geocoder: false, // 是否显示geocoder小器件，右上角查询按钮
    homeButton: false, // 是否显示Home按钮
    infoBox: false, // 是否显示信息框
    sceneModePicker: false, // 是否显示3D/2D选择器
    selectionIndicator: false, // 是否显示选取指示器组件
    timeline: false, // 是否显示时间轴
    navigationHelpButton: false, // 是否显示右上角的帮助按钮
    scene3DOnly: false, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
    //天地图影像
    imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
      url: `http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${TianDiTuToken}`,
      layer: 'tdtBasicLayer',
      style: 'default',
      format: 'image/jpeg',
      tileMatrixSetID: 'GoogleMapsCompatible',
    })
  })
}

export function flyToPosition(viewer, longLatHeiObj, Cesium) {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(longLatHeiObj.longitude, longLatHeiObj.latitude, longLatHeiObj.height),//相机（眼睛）位置，经度，纬度和高度
    orientation: {
      heading: Cesium.Math.toRadians(0),    //朝向 0.0 朝北、90 朝东、180 朝南
      pitch: Cesium.Math.toRadians(-90),       //俯仰
      roll: 0.0                                //滚转
    },
    duration: 5      //飞过来的时间距离
  })
}

export function setViewPosition(viewer, longLatHeiObj, Cesium) {
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(longLatHeiObj.longitude, longLatHeiObj.latitude, longLatHeiObj.height),//相机（眼睛）位置，经度，纬度和高度
    orientation: {
      heading: Cesium.Math.toRadians(0),    //朝向 0.0 朝北、90 朝东、180 朝南
      pitch: Cesium.Math.toRadians(-90),       //俯仰
      roll: 0.0                                //滚转
    }
  })
}

export function addPoint2(viewer, longLatHeiObj, Cesium,pointID) {
  //添加点方式2
  let pointEntity2 = new Cesium.Entity({
    id: pointID,
    position: Cesium.Cartesian3.fromDegrees(longLatHeiObj.longitude, longLatHeiObj.latitude),
    point: {
      pixelSize: 10,
      color: Cesium.Color.RED,
      outlineColor: Cesium.Color.RED,
      outlineWidth: 2,
    }
  });
  viewer.entities.add(pointEntity2);
}


//添加点
export function addPoint(dataSource, longLatHeiObj, Cesium,pointID) {
  //添加点
  dataSource.entities.add({
    id: pointID,
    position: Cesium.Cartesian3.fromDegrees(longLatHeiObj.longitude, longLatHeiObj.latitude,),
    point: {
      pixelSize: 10,
      color: Cesium.Color.YELLOW,
      outlineColor: Cesium.Color.RED,
      outlineWidth: 2,
    }
  });
}

//添加线实体
export function addPolylineRetLineEntity(Cesium,lineID) {
  let polylineEntity = new Cesium.Entity({
    id: lineID,
    name: "boderLine",
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        118.5, 42,
        117.5, 39
      ]),
      height: 100,
      width: 2,
      material: Cesium.Color.YELLOW
    }
  });
  return polylineEntity;
}

//添加面
export function addPolygon(dataSource, Cesium, polygonLatlon,polygonID) {
  let polygonEntity = new Cesium.Entity({
    id: polygonID,
    name: "this_is_a_polygon",
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        118.5, 42,
        117.5, 42,
        117.5, 39,
        118.5, 39,
        118.5, 42
      ]),
      height: 100,
      material: Cesium.Color.RED.withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.BLUE,
      outlineWidth: 2,
      fill: true
    }
  });
  //dataSource.entities.add(polygonEntity);
  return polygonEntity;
}


//移除点
export function removePoint(viewer,dataSource,pointId){
  let tmpPoint=viewer.entities.getById(pointId);
  //方法1移除点
  viewer.entities.remove(tmpPoint);
}

//移除线
export function removeLine(viewer,dataSource,lineId){
    //方法2移除
  //viewer.entities.removeById("polylinetest")
  let tmpPoline=dataSource.entities.getById(lineId);
  console.log(tmpPoline);
  dataSource.entities.remove(tmpPoline);
  console.log("移除线");

}

//移除面
export function removePolygon(viewer,dataSource,polygonID){
  // let tmpPolygon=viewer.entities.getById(polygonID);
  // viewer.entities.remove(tmpPolygon);
  console.log(dataSource);
  let tmpPolygon=dataSource.entities.getById(polygonID);
  console.log(tmpPolygon);
  //viewer.entities.remove();
  dataSource.entities.remove(tmpPolygon);
  console.log("移除面");
}

//弧度转经纬度
export function getLatLng(viewer,Cesium,){
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (movement) {
      var ray = viewer.camera.getPickRay(movement.position);
      if (!ray) return null;
      var position = viewer.scene.globe.pick(ray, viewer.scene);
      console.log(movement.position);     //这里是输出x,y
      console.log(position);          //输出x,y,z
      var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
      console.log(cartographic);  //经纬度高度
      var lon = Cesium.Math.toDegrees(cartographic.longitude);    //弧度转经度
      var lat = Cesium.Math.toDegrees(cartographic.latitude);     //弧度转纬度
      console.log(lon, lat);  //经纬度
      alert(lon,lat);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  return handler;
}

//关闭handler点击事件
export function closeHandler(handler,Cesium){
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)//移除事件
}

//添加图片
export function addImgeToMap(dataSource,Cesium,picUrl,latLngObj,picId){
  let ele=dataSource.entities.add({
    id :picId,
    position:Cesium.Cartesian3.fromDegrees(latLngObj.longitude,latLngObj.latitude,latLngObj.height),
    billboard:{

        image:picUrl,
        scale:0.5,
        width:4000,
        height:3000,
        sizeInMeters:true
    },
    label:{
        text:"label1",
    },
    point:{
        pixelSize:10,
        color:Cesium.Color.RED
    }
  });
  return ele;
}

//移除图片
export function removeElementOfEntities(dataSource,picId){
  let tmpPic=dataSource.entities.getById(picId);
  //console.log(tmpPic);
  dataSource.entities.remove(tmpPic);
  console.log("移除Pic");
}

//添加geojson
export function addGeojsonToMap(viewer,Cesium,jsonUrl,bfsName){
  let geoPromise= Cesium.GeoJsonDataSource.load(jsonUrl,{
    stroke:Cesium.Color.WHITE,  // 边框颜色
    fill:Cesium.Color.BLUE.withAlpha(0.3),
    strokeWidth:5,  // 边框宽度
    //clampToGround:true
  })
  geoPromise.then((bfs)=>{
    viewer.dataSources.add(bfs);
    bfs.name=bfsName;
  });
  return geoPromise;
}

//添加地形数据
export function addTerrianToMap(viewer,Cesium,urlTerrian){
  let terrainProvider = new Cesium.CesiumTerrainProvider({
    url:urlTerrian
  });
  return terrainProvider;
}