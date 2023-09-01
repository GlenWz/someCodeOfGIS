package org.example;

public class LonlatConver {
    /**
     * 椭球体长半轴
     */
    public final static double a = 6378245.0;
    /**
     * 扁球率
     */
    public final static double ee = 0.00669342162296594323;

    //圆周率
    public final static double pi = 3.14159265358979323;


    /**
     * @Description WGS84 to 火星坐标系 (GCJ-02)
     * @param lon  经度
     * @param lat  纬度
     * @return
     */
    public static double[] wgs84ToGcj02(double lon, double lat) {
        if (outOfChina(lat, lon)) {
            return null;
        }
        double dLat = transformLat(lon - 105.0, lat - 35.0);
        double dLon = transformLon(lon - 105.0, lat - 35.0);
        double radLat = lat / 180.0 * pi;
        double magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        double sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
        double mgLat = lat + dLat;
        double mgLon = lon + dLon;
        return new double[] { mgLon, mgLat };
    }

    /**
     * @Description 火星坐标系 (GCJ-02) to WGS84
     * @param lon
     * @param lat
     * @return
     */
    public static double[] gcj02ToWgs84(double lon, double lat) {
        double[] gps = transform(lat, lon);
        double lontitude = lon * 2 - gps[1];
        double latitude = lat * 2 - gps[0];
        return new double[] { lontitude, latitude };
    }

    /**
     * @Description 火星坐标系 (GCJ-02) to 百度坐标系 (BD-09)
     * @param lon 经度
     * @param lat 纬度
     * @return
     */
    public static double[] gcj02ToBd09(double lon, double lat) {
        double x = lon, y = lat;
        double z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * pi* 3000.0 / 180.0);
        double theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * pi* 3000.0 / 180.0);
        double bdLon = z * Math.cos(theta) + 0.0065;
        double bdLat = z * Math.sin(theta) + 0.006;
        return new double[] { bdLon, bdLat };
    }

    /**
     * @Description 百度坐标系 (BD-09) to 火星坐标系 (GCJ-02)
     * @param bdLon 百度经度
     * @param bdLat 百度纬度
     * @return
     */
    public static double[] bd09ToGcj02(double bdLon, double bdLat) {
        double x = bdLon - 0.0065, y = bdLat - 0.006;
        double z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * pi* 3000.0 / 180.0);
        double theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * pi* 3000.0 / 180.0);
        double ggLon = z * Math.cos(theta);
        double ggLat = z * Math.sin(theta);
        return new double[] { ggLon, ggLat};
    }
    /**
     * @Description 百度坐标系 (BD-09) to WGS84
     * @param bdLat 百度纬度
     * @param bdLon 百度经度
     * @return
     */
    public static double[] bd09ToWgs84(double bdLon,double bdLat) {
        double[] gcj02 = LonlatConver.bd09ToGcj02(bdLon, bdLat);
        double[] map84 = LonlatConver.gcj02ToWgs84(gcj02[0], gcj02[1]);
        return map84;
    }

    /**
     * @Description WGS84 to 百度坐标系 (BD-09)
     * @param wgsLon
     * @param wgsLat
     * @return
     */
    public static double[] wgs84ToBd09(double wgsLon,double wgsLat){
        double [] gcj02= wgs84ToGcj02(wgsLon,wgsLat);
        double [] bd09=gcj02ToBd09(gcj02[0],gcj02[1]);
        return bd09;
    }

    /**
     * @Description 判断是否在中国范围内
     * @param lat 纬度
     * @param lon 经度
     * @return
     */
    public static boolean outOfChina(double lat, double lon) {
        if (lon < 72.004 || lon > 137.8347)
            return true;
        if (lat < 0.8293 || lat > 55.8271)
            return true;
        return false;
    }

    /**
     * @Description transform
     * @param lat
     * @param lon
     * @return
     */
    private static double[] transform(double lat, double lon) {
        if (outOfChina(lat, lon)) {
            return new double[] { lat, lon };
        }
        double dLat = transformLat(lon - 105.0, lat - 35.0);
        double dLon = transformLon(lon - 105.0, lat - 35.0);
        double radLat = lat / 180.0 * pi;
        double magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        double sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
        double mgLat = lat + dLat;
        double mgLon = lon + dLon;
        return new double[] { mgLat, mgLon };
    }

    /**
     * @Description This method is used to transform the latitude component of a coordinate.
     *   It applies a series of mathematical transformations to the latitude value.
     * @param x The x-coordinate value.
     * @param y The y-coordinate value.
     * @return  The transformed latitude value
     */
    private static double transformLat(double x, double y) {
        double ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y
                + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
        return ret;
    }

    /**
     * @Description
     * @param x
     * @param y
     * @return
     */
    public static double transformLon(double x, double y) {
        double ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1
                * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0
                * pi)) * 2.0 / 3.0;
        return ret;
    }
}
