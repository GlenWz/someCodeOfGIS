<template>
  <div>
    <div id="cesiumContainer"></div>
    <div class="buton-list">
      <button @click="rePoint()">移除点</button>
      <button @click="reLine()">移除线</button>
      <button @click="rePolygon()">移除面</button>
      <button @click="latlng()" :isClick="isGetlatlng">
        {{ getlatlngTxt }}
      </button>
      <button @click="addPicture()">{{ addPicTxt }}</button>
      <button @click="addGeojson()">{{ addGeojsonTxt }}</button>
      <button @click="addTerrian()">{{ addTerrianTxt }}</button>
      <button @click="addhightLight()">{{ hightLightTxt }}</button>
    </div>
  </div>
</template>

<script>
import * as Cesium from "cesium";
import "cesium/Source/Widgets/widgets.css";
import {
  initCesium,
  flyToPosition,
  addPoint,
  setViewPosition,
  addPoint2,
  addPolygon,
  addPolylineRetLineEntity,
  removePoint,
  removeLine,
  removePolygon,
  addText,
  getLatLng,
  closeHandler,
  addImgeToMap,
  removeElementOfEntities,
  addGeojsonToMap,
  addTerrianToMap,
} from "../common/js/initCesium";
import { hightLightJson } from "../common/js/hightLight";
export default {
  components: {},
  name: "CesiumScene",
  data() {
    return {
      longLatHeiObj: {
        latitude: 39.5,
        longitude: 116.4,
        height: 550000,
      },
      longLatHeiObj1: {
        latitude: 39.6,
        longitude: 116.3,
        height: 550000,
      },
      thisViewer: null,
      thisDataSource: null,
      getlatlngTxt: "开启经纬度",
      isGetlatlng: false,
      handler: null,
      addPicTxt: "添加图片",
      addGeojsonTxt: "添加JSON",
      geojsonBeijingLayer: null,
      addTerrianTxt: "添加地形",
      hightLightTxt:"开启高亮"
    };
  },
  mounted() {
    this.thisViewer = initCesium(Cesium);
    let viewer = this.thisViewer;
    //创建dataSources方便数据管理
    this.thisDataSource = new Cesium.CustomDataSource("enetiesData");
    let dataSource = this.thisDataSource;
    viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏版权信息
    //flyToPosition(viewer,this.longLatHeiObj,Cesium);
    setViewPosition(viewer, this.longLatHeiObj, Cesium);
    viewer.dataSources.add(dataSource);
    addPoint(dataSource, this.longLatHeiObj, Cesium, "poittest");
    addPoint2(viewer, { latitude: 39.2, longitude: 116 }, Cesium, "pointtest2");
    let retPolygonEntity = addPolygon(dataSource, Cesium, "polygontest");
    dataSource.entities.add(retPolygonEntity);
    let retLineEntity = addPolylineRetLineEntity(Cesium, "polylinetest");
    dataSource.entities.add(retLineEntity);
    //let handler=getLatLng(viewer,Cesium);
  },
  methods: {
    rePoint() {
      //要加进viewer.entities里面才能移除
      removePoint(this.thisViewer, this.thisDataSource, "pointtest2");
    },
    reLine() {
      removeLine(this.thisViewer, this.thisDataSource, "polylinetest");
    },
    rePolygon() {
      removePolygon(this.thisViewer, this.thisDataSource, "polygontest");
    },
    latlng() {
      if (this.isGetlatlng) {
        this.getlatlngTxt = "开启经纬度";
        this.isGetlatlng = false;
        closeHandler(this.handler, Cesium);
      } else {
        this.getlatlngTxt = "关闭经纬度";
        this.isGetlatlng = true;
        this.handler = getLatLng(this.thisViewer, Cesium);
      }
    },
    addPicture() {
      let longLatHeiObjPic = { latitude: 39.5, longitude: 116.8, height: 55 };
      if (this.addPicTxt == "添加图片") {
        this.addPicTxt = "移除图片";
        let picUrl = "images/logo.png";
        //let picUrl = "../../assets/logo.png";
        addImgeToMap(
          this.thisDataSource,
          Cesium,
          picUrl,
          longLatHeiObjPic,
          "picVue01"
        );
      } else {
        removeElementOfEntities(this.thisDataSource, "picVue01");
        this.addPicTxt = "添加图片";
      }
    },
    addGeojson() {
      if (this.addGeojsonTxt == "添加JSON") {
        let jsonUrl = "js/beijing.json";
        this.geojsonBeijingLayer = addGeojsonToMap(
          this.thisViewer,
          Cesium,
          jsonUrl,
          "beijing"
        );
        this.addGeojsonTxt = "移除JSON";
      } else {
        this.addGeojsonTxt = "添加JSON";
        if (this.geojsonBeijingLayer) {
          this.thisViewer.dataSources.remove(
            this.thisViewer.dataSources.getByName("beijing")[0]
          );
        }
      }
    },
    addTerrian() {
      //添加和移除地形数据
      let terrainProviderL=null;
      if (this.addTerrianTxt == "添加地形") {
        this.addTerrianTxt = "移除地形";
        let urlTerrian = "http://localhost:8090";   //通过IIS发布
        terrainProviderL=addTerrianToMap(this.thisViewer, Cesium, urlTerrian);
      } else {
        terrainProviderL = new Cesium.EllipsoidTerrainProvider({});
        this.addTerrianTxt = "添加地形";
      }
      this.thisViewer.terrainProvider=terrainProviderL;
    },
    //开启geojson高亮和关闭高亮
    addhightLight(){
      if(this.hightLightTxt=="开启高亮"){
        this.hightLightTxt="关闭显示";
        let jsonUrl = "js/beijing.json";
        this.handler=hightLightJson(this.thisViewer,Cesium,jsonUrl,"bjMoveJson");
      }else{
        //这个地方可以优化一下
        this.hightLightTxt="开启高亮";
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)//移除事件
        console.log(this.thisViewer.dataSources.getByName("bjMoveJson"));     //show
        this.thisViewer.dataSources.getByName("bjMoveJson")[0].show=false;
        this.thisViewer.dataSources.getByName("bjMoveJson")[1].show=false;
        //this.thisViewer.dataSources.remove(this.thisViewer.dataSources.getByName("bjMoveJson")[0]);
      }
    }
  },
};
</script>

<style>
html,
body,
#cesiumContainer {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.buton-list {
  width: 200px;
  height: 200px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
}
</style>