<template>
  <div class="mapContainer" id="mapContainer">
      <div >

      </div>
  </div>
</template>

<script>
import jsonChina from '../../static/china.js'
import jsonChongqing from '../../static/chongqing.js'
import jsonsichuan from '../../static/sichuan.js'
import jsonGuizhou from '../../static/guizhou.js'
import jsonYunnan from '../../static/yunnan.js'
import jsonGuangdong from '../../static/guangdong.js'
import jsonGuangxi from '../../static/guangxi.js'
import array5A from '../../static/fiveAA.js'
import windy230227 from '../../static/windy230227.json'
import windyGlobalTest from '../../static/wind-global.json'
import rainGlobalTest from '../../static/rain.json'

//usa
import usa_geoJson from '../../static/USA/usaGeojson.js'
import usa_dataFile from '../../static/USA/usaCases.js'
import usa_geojsonDensity from '../../static/USA/usaGeojsonDen.js'

//chaina
import china_geoJson from '../../static/China/chinaGeojson.js'
import yunnan_geoJson from '../../static/China/yunnanTem.js'
export default {
  name: 'mapContainer',
  data () {
    return {
      hi:"hello",
      map:null,
      baseLayers:null,
      overLayers:null,
      someLayers:null,
      layerGroup:null,
      overlayersControl:null,
      centerLat:33.4,
      centerLon:109.6,
      centerZoom:5,
      overLayersCQpolyGon:null,
      overLayersSCpolyGon:null,
      overLayersGZpolyGon:null,
      overLayersYNpolyGon:null,
      overLayersGDpolyGon:null,
      overLayersGXpolyGon:null
    }
  },
  mounted(){
    
    this.initMap(),
    this.initGeojson(),
    this.testAddlayerControl(),
   
    this.add5AclusterLayer(),
    this.addWindy(),
    this.addUSACovid19(),
    this.addHeatMap(),
    this.addHanFei()
    //this.addClusterLayer()
  },
  methods:{
    initMap(){
      let Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, ' +
              'AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      });
      let Esri_Night = L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, ' +
              'AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      });
      let osm_1=L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',{
        attribution:'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      });

      this.baseLayers={
          "<span>OSM</span>":osm_1,
          "<span>Esri夜景图</span>":Esri_Night,
          "<span>Esri影像图</span>":Esri_WorldImagery,
      }     
      this.layerGroup=L.layerGroup([]);
      this.map=this.$utils.map.createMap("mapContainer",{
           zoomControl:false,
           center:[26.4677,106.62],
           //center:[this.centerLat,this.centerLon],
           //zoom:this.centerZoom,
           zoom:12,
           layers:[osm_1],
           zoomControl:true,
           attributionControl:true
      })
      this.$utils.map.addBaseLayers(this.baseLayers,this.map,{collapsed:false, hideSingleBase:true});
      //this.$utils.map.addOverLayers(this.baseLayers,this.map)
      this.$utils.map.addEditTools(this.map);
      this.$utils.map.addScale(this.map);
    },
    initGeojson(){
      //后面修改一下
      this.overLayersCQpolyGon=this.$utils.map.addJsonPolygon(this.map,jsonChongqing,{},null);
      this.overLayersSCpolyGon=this.$utils.map.addJsonPolygon(this.map,jsonsichuan,{
        color:'red'
      },null);
      this.overLayersGZpolyGon=this.$utils.map.addJsonPolygon(this.map,jsonGuizhou,{
        color:'yellow'
      },null);
      this.overLayersYNpolyGon=this.$utils.map.addJsonPolygon(this.map,jsonYunnan,{
        color:'white'
      },null);
      this.overLayersGDpolyGon=this.$utils.map.addJsonPolygon(this.map,jsonGuangdong,{
        color:'deepskyblue'
      },null);
      this.overLayersGXpolyGon=this.$utils.map.addJsonPolygon(this.map,jsonGuangxi,{
        color:'orange'
      },null);
      this.overLayers={
        "重庆市":this.overLayersCQpolyGon,
        "四川省":this.overLayersSCpolyGon,
        "贵州省":this.overLayersGZpolyGon,
        "云南省":this.overLayersYNpolyGon,
        "广西省":this.overLayersGXpolyGon,
        "广东省":this.overLayersGDpolyGon
      }
      this.overlayersControl=this.$utils.map.addoverlayers(this.overLayers,this.map,{collapsed:false, hideSingleBase:true})

    },
    testAddlayerControl(){
      const crownHill = L.marker([25.75, 115.09]).bindPopup('This is Crown Hill Park.');
	    const rubyHill = L.marker([31.68, 105.00]).bindPopup('This is Ruby Hill Park.');
	    const parks = L.layerGroup([crownHill, rubyHill]);
      this.$utils.map.addLayerGroupToOverlaysers(this.overlayersControl,parks,"sayHi");
    },
    addClusterLayer(){
      //随机生成11111个聚合点
      let cluster=this.$utils.map.addMakerCluster();
      //let cluster=this.$utils.map.addMakerCluster();
      for(let i=0;i<111111;i++){
        let latLng=this.$utils.map.getRandomLatLng(this.map);
        let maker=this.$utils.map.addMakerByLatLng(latLng,this.map);
        cluster.addLayer(maker);
      }
      this.map.addLayer(cluster);
    },
    add5AclusterLayer(){
      let cluster=this.$utils.map.addMakerCluster();
      for(let i=0;i<array5A.length;i++){
        let tmpStr=array5A[i].name;
        let latLng={
          lat:array5A[i].lat,
          lng:array5A[i].lng
        }
        let maker=this.$utils.map.retCreatMakerByLatLng(latLng,tmpStr);
        cluster.addLayer(maker);
      }
      this.$utils.map.addLayerGroupToOverlaysers(this.overlayersControl,cluster,"全国5A景区");
    },
    addWindy(){
      let retWindyLayer=this.$utils.map.addWindyLayer(windy230227);
      console.log(retWindyLayer);
      //let retWindyLayer=this.$utils.map.addWindyLayer(rainGlobalTest);
      //let retWindyLayer=this.$utils.map.addWindyLayer(windyGlobalTest);
      this.$utils.map.addLayerGroupToOverlaysers(this.overlayersControl,retWindyLayer,"风场情况");
    },
    addUSACovid19(){
      //let retUsaLayer=this.$utils.map.addUSACovid19(this.map,usa_geoJson,usa_dataFile);
      //let retUsaLayer=this.$utils.map.addUSACovid19(this.map,usa_geojsonDensity,usa_dataFile);
      //china data  china_geoJson 
      let retUsaLayer=this.$utils.map.addUSACovid19(this.map,china_geoJson,usa_dataFile);
      //this.$utils.map.addLayerGroupToOverlaysers(this.overlayersControl,retUsaLayer[0],"人口密度情况");  
      this.$utils.map.addLayerGroupToOverlaysers(this.overlayersControl,retUsaLayer[1],"人口密度情况");
      retUsaLayer[2].addTo(this.map);
    },
    addHeatMap(){
      let dataFeatures=yunnan_geoJson.features;
      //testData
      let heatMapData={
        max:35,
        data:[]
      }
      for(let i=0;i<dataFeatures.length;i++){
        let tmpObj={
          lat:dataFeatures[i].properties.cp[1],
          lng:dataFeatures[i].properties.cp[0],
          count:dataFeatures[i].properties.temperature
        }
        let tmpObj2={
          lat:dataFeatures[i].properties.cp[1]+(i-0.8),
          lng:dataFeatures[i].properties.cp[0]+(i+0.2),
          count:dataFeatures[i].properties.temperature+i
        }
        let tmpObj3={
          lat:dataFeatures[i].properties.cp[1]+(i),
          lng:dataFeatures[i].properties.cp[0]+(i+0.5),
          count:dataFeatures[i].properties.temperature+i
        }
        let tmpObj4={
          lat:dataFeatures[i].properties.cp[1],
          lng:dataFeatures[i].properties.cp[0]+(i+0.5),
          count:dataFeatures[i].properties.temperature+i
        }
        heatMapData.data.push(tmpObj);
        heatMapData.data.push(tmpObj2);
        heatMapData.data.push(tmpObj3);
        heatMapData.data.push(tmpObj4);
      }
      let config={
        'radius': 1,
        'maxOpacity': 0.8,
        'scaleRadius': true,
        'useLocalExtrema': true,
        latField: 'lat',
        lngField: 'lng',
        valueField: 'count'
      }
      let retHeatMapLayer=this.$utils.map.addHeatMap(this.map,heatMapData,config);
      this.$utils.map.addLayerGroupToOverlaysers(this.overlayersControl,retHeatMapLayer,"热力图");
    },
    addHanFei(){
      this.$utils.map.createHANFEI(this.map);
      //console.log("sayHi");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .mapContainer{
    width: 100%;
    height: 100%;
    
  }
</style>
