const proj4 = require('proj4');

/*
初始化高斯投影中央经线
*/
let gaussKCenterLon=new Map();
for(let i=25,center=75;i<45;i++,center+=3){
    gaussKCenterLon.set(center,i);
}

/*
初始化UTM投影中央经线
*/
let utmCenterLon=new Map();
for(let i=43,centerL=75;i<53;i++,centerL+=6){
    utmCenterLon.set(centerL,i);
}

  /**
   * wgs84坐标系转墨卡托投影
   * @param lon WGS84经度
   * @param lat WGS84坐标纬度
   * @returns {number[]} 返回转换为墨卡托投影之后的米制单位
   */
function wgs84ToMercator(lon,lat){
    let ret=[];
    if(lon>=0&&lon<=360&&lat<90&&lat>-90){
        let x=lon*20037508.342789/180;
        let y=Math.log(Math.tan((90+lat)*Math.PI/360))/(Math.PI/180);
        y=y*20037508.34789/180;
        ret[0]=x;
        ret[1]=y;
    }else{
        console.log("input the lon or lat error!");
    }
    return ret;
}

  /**
   * wgs84坐标系转墨卡托投影
   * @param x x坐标
   * @param y y坐标
   * @returns {number[]} 返回转换为wgs84之后的经纬度数组
   */
function mercatorToWgs84(x,y){
    const originShift = Math.PI * 6378137;
    const lon = (x / originShift) * 180;
    let lat = (y / originShift) * 180;
    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
    return [lon, lat];
}

  /**
   * UTM投影米制坐标转wgs84(EPSG:4326)
   * @param fromProj EPSG代码
   * @param centerLon 中央经线
   * @param x x坐标
   * @param y y坐标
   * @returns {number[]} 返回转换经纬度坐标
   */
function gaussKLatlonProjToWGS84(fromProj,centerLon,x,y){
    let retList=[];
    let codeOfRegion=utmCenterLon.get(centerLon); 
    if(codeOfRegion==undefined){
        console.log("centerLon is error");
    }else{
        const utm=`PROJCS["WGS 84 / UTM zone ${codeOfRegion}N",GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",0],PARAMETER["central_meridian",${centerLon}],PARAMETER["scale_factor",0.9996],PARAMETER["false_easting",500000],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["Easting",EAST],AXIS["Northing",NORTH],AUTHORITY["EPSG","${fromProj}"]]`;
        const wgs84=`GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG", "6326"]], PRIMEM["Greenwich", 0, AUTHORITY["EPSG", "8901"]],UNIT["degree", 0.0174532925199433, AUTHORITY["EPSG", "9122"]], AUTHORITY["EPSG", "4326"]]`   
        const newCoordinates = proj4(utm, wgs84, [parseFloat(x),parseFloat(y)]);
        retList=newCoordinates;
    }
    return retList;
}

  /**
   * 高斯克吕格投影米制坐标转wgs84(EPSG:4326)
   * @param fromProj ESPG代码
   * @param centerLon 中央经线
   * @param x坐标
   * @param y坐标
   * @returns {number[]} 返回转换经纬度之后的坐标
   */
function gaussKMeterProjToWGS84(fromProj,centerLon,x,y){
    let retList=[];
    let codeOfregion=gaussKCenterLon.get(centerLon);
    if(codeOfregion==undefined){
        console.log("centerLon is error");
    }else{    
    const wgs84=`GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG", "6326"]], PRIMEM["Greenwich", 0, AUTHORITY["EPSG", "8901"]],UNIT["degree", 0.0174532925199433, AUTHORITY["EPSG", "9122"]], AUTHORITY["EPSG", "4326"]]`   
    const gaussK=`PROJCS["CGCS2000 / 3-degree Gauss-Kruger zone ${codeOfregion}",GEOGCS["China Geodetic Coordinate System 2000",DATUM["China_2000",SPHEROID["CGCS2000",6378137,298.257222101,AUTHORITY["EPSG","1024"]],AUTHORITY["EPSG","1043"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4490"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",0],PARAMETER["central_meridian",${centerLon}],PARAMETER["scale_factor",1],PARAMETER["false_easting",39500000],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AUTHORITY["EPSG","${fromProj}"]]`; 
    //gaussk->wgs84
    const newCoordinates = proj4(gaussK, wgs84, [parseFloat(y),parseFloat(x)]);
    retList=newCoordinates;
    }
    return retList;
}


