import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Icon from "leaflet/dist/images/marker-icon.png"
import IconShadow from "leaflet/dist/images/marker-shadow.png"

import '@geoman-io/leaflet-geoman-free';  
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'; 

//引入聚合
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet.markercluster";

//引入风场
import 'leaflet-velocity/dist/leaflet-velocity.css'
import 'leaflet-velocity/dist/leaflet-velocity'


//引入heatMap
import heatMapOverlay from 'heatmap.js/plugins/leaflet-heatmap'


//Icon
let DefaultIcon=L.icon({
    iconUrl:Icon,
    shadowUrl:IconShadow
  })
  
L.Marker.prototype.options.icon=DefaultIcon;

//创建地图
const createMap = (divId, options) => {
    let map = L.map(divId, options);
    return map;
};
//加载底图
const addBaseLayers=(baseLayers,map,options)=>{
    L.control.layers(baseLayers,null,options).addTo(map);
}
//加载overlayers
const addoverlayers=(overlayers,map,options)=>{
    let overlayersControl=L.control.layers(null,overlayers,options).addTo(map);
    return overlayersControl;
}

const addMakerByLatLng=(latLng,map)=>{
    let retMaker=L.marker(latLng)
    //.addTo(map);
    //.bindPopup("this is a bind string")
    //.openPopup()
    return retMaker;
}

const retCreatMakerByLatLng=(latLng,bindTxt)=>{
    let retMaker=L.marker(latLng).bindPopup(bindTxt)
    //.openPopup();
    return retMaker;
}

const addEditTools=(map)=>{
    map.pm.setLang("zh");
    map.pm.addControls({
    position: "topleft",
    drawPolygon: true, //绘制多边形
    drawMarker: true, //绘制标记点
    drawCircleMarker: true, //绘制圆形标记
    drawPolyline: true, //绘制线条
    drawRectangle: true, //绘制矩形
    drawCircle: true, //绘制圆圈
    drawText:true,
    drawControls:true,
    editControls:true,
    scaleMode:true,
    editMode: true, //编辑多边形
    dragMode: true, //拖动多边形
    cutPolygon: true, //添加⼀个按钮以删除多边形⾥⾯的部分内容
    removalMode: true, //清除多边形
    });
    
    //map.pm.setGlobalOptions({ pinning: true, snappable: false });
    map.on("pm:drawstart", (e)=>{
       // map.pm.setGlobalOptions({ measurements: { measurement: true, displayFormat: 'metric', pinning: true } })
        map.pm.setGlobalOptions({ measurements: { measurement: true, displayFormat: 'metric' } })
        console.log(e.workingLayer._latlngs);    
    });
      
    map.on("pm:drawend", (e) => {
        console.log(e, "禁⽌绘制、绘制结束");
    });
}

const addScale=(map)=>{
    L.control.scale({
        position:"bottomleft"
    }).addTo(map)
}

const addJsonPolygon=(map,jsonFile,options,bindTxt)=>{
    //console.log("this is addJsonPolygon")
    //let retJson=L.polygon(jsonFile,options);
    let retJson=L.geoJSON(jsonFile,{options})
    //.addTo(map);
    return retJson;
}
const addJsonPolyine=(map,jsonFile,options,bindTxt)=>{
    console.log("this is polyline")
    let retJson=L.geoJSON(jsonFile,{}).addTo(map);
    return retJson;
}
const addLayerGroupToOverlaysers=(layerControl,groupArrayList,groupName)=>{
    layerControl.addOverlay(groupArrayList,groupName);
}

const getRandomLatLng=(map)=>{
    let bounds = map.getBounds(),
    southWest = bounds.getSouthWest(),
    northEast = bounds.getNorthEast(),
    lngSpan = northEast.lng - southWest.lng,
    latSpan = northEast.lat - southWest.lat;
  return L.latLng(
    southWest.lat + latSpan * Math.random(),
    southWest.lng + lngSpan * Math.random()
  );
}



//添加点聚合
const addMakerCluster=()=>{
    return L.markerClusterGroup();
}

//添加风场
const addWindyLayer=(jsonFile)=>{
    let velocityLayer = L.velocityLayer({
        displayValues: true,
         displayOptions: {
             velocityType: 'GBR Wind',
             displayPosition: 'bottomleft',
             displayEmptyString: 'No wind data'
         },
         data: jsonFile,//风场数据
         minVelocity: 0, //Velocity：速率
         maxVelocity: 15,
         //velocityScale: 0.001,
         //lineWidth: 5,                     //粒子的粗细
         //frameRate: 15,                      //定义每秒执行的次数
         //colorScale: ['orange','red']
         // particleMultiplier: 1 / 1200,//粒子的数量
     });
    return velocityLayer;
}

const addUSACovid19=(map,jsonFile,dataFile)=>{
    function getColor(d){
        return d>5000?'#800026':
        d>2000?'#bd0026':
        d>500?'#E31A1C':
        d>200?'#FC4E2A':
        d>100?'#FD8D3C':
        d>50?'#FEB24C':
        d>10?'#FED976':
        '#FFEDA0';
    }
    let mapStyle=function(feature){
        return {
            fillColor:getColor(feature.properties.density),
            weight:2,
            opacity:1,
            color:'white',
            dashArray:'3',
            fillOpacity:0.7
        };
    }
    
    //console.log("sayHello");
    //L.geoJson(jsonFile,{style:mapStyle}).addTo(map);
    let retDataJson=L.geoJson(jsonFile,{style:mapStyle});
    //鼠标停留加强
    let geojson=L.geoJson();
    let info=L.control();

    //添加密度信息
    info.onAdd=function(){
        this._div=L.DomUtil.create('div','info');
        this._div.style.backgroundColor='rgba(255,255,255,1)';
        this.update();
        return this._div;
    };
    info.update=function(props){
        this._div.innerHTML='<h3>人口密度情况</h3>'+(props?
        '<b>'+props.name+'</b><br/>'+props.density+' people / km<sup>2</sup>'
        : '打开人口密度图层</br>鼠标放在某个省上显示人口密度');
    };
    //info.addTo(map);    


    function highF(e){
        var layer=e.target;
        layer.setStyle({
            weight:5,
            color:'#eee',
            dashArray:'',
            fillOpacity:0.7
        });
        if(!L.Browser.ie&&!L.Browser.opera&&!L.Browser.edge)
        {
            layer.bringToFront();
        }
        info.update(layer.feature.properties);
    }
    function resetHighlight(e){
        //console.log(e);
        geojson.resetStyle(e.target);
        info.update();
    }    

    function zoomToFeature(e){
        map.fitBounds(e.target.getBounds());
    }
    function onEachFeature(feature,layer){
        layer.on({
            mouseover:highF,		//停留鼠标加强
            mouseout:resetHighlight,//这是啥灰色
            click:zoomToFeature	//点击进入州
        });
    }
    geojson=L.geoJson(jsonFile,{
        style:mapStyle,
        onEachFeature:onEachFeature
    })
    //.addTo(map);
    return [retDataJson,geojson,info];
}

const addHeatMap=(map,heatMapData,config)=>{
    let retHeatMapLayer=new heatMapOverlay(config);
    retHeatMapLayer.setData(heatMapData);
    return retHeatMapLayer;
}

const createHANFEI=(map)=>{
    //26.4677/106.6451
    let redStart = new LeafIcon({iconUrl: 'leaf-red.png'});
    let latLng=[26.4677,106.6451];
    let guiyangLG=[26.57,106.71];
    let bindTxt="金竹镇";
    let retMaker=L.marker([26.4677,106.62]).addTo(map).bindPopup(bindTxt).openPopup();
    let retMaker2=L.marker([26.57,106.71]).addTo(map).bindPopup("贵阳市").openPopup();
    let retMaker3=L.marker([26.43,106.69]).addTo(map).bindPopup("花溪区").openPopup();
}


export default{
    createMap,
    addBaseLayers,
    addoverlayers,
    addEditTools,
    retCreatMakerByLatLng,
    addMakerByLatLng,
    addScale,
    addJsonPolygon,
    addJsonPolyine,
    addLayerGroupToOverlaysers,
    getRandomLatLng,
    addMakerCluster,
    addWindyLayer,
    addUSACovid19,
    addHeatMap,
    createHANFEI
}