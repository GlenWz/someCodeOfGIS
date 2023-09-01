
import java.util.ArrayList;

import javax.servlet.http.HttpServletRequest;

import org.apache.regexp.RETest;
import org.locationtech.jts.geom.Geometry;
import org.locationtech.jts.geom.MultiPolygon;
import org.locationtech.jts.geom.Polygon;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKBReader;
import org.springframework.context.annotation.Scope;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;



@Scope("request")
@RestController
@RequestMapping("getoverlapproportion")
public class getOverlapProportion
{

       
    @RequestMapping(value="/getoverlapproportion",method=RequestMethod.POST)
    public JSONObject getOverlapProportion(HttpServletRequest request,@RequestBody String params) {
        JSONObject parm=JSONObject.parseObject(params);
        JSONObject retJson=new JSONObject();
        String gemo1=parm.getString("gemo1");
        String gemo2=parm.getString("gemo2");
        ArrayList<Geometry> geomList=new ArrayList<>();
        WKBReader wkbReader = new WKBReader();
        try {
            geomList.add(wkbReader.read(WKBReader.hexToBytes(gemo1))) ;
            geomList.add(wkbReader.read(WKBReader.hexToBytes(gemo2))) ;
        }
        catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            retJson.put("Error", "数据错误无法判断");
            return retJson;
        }
        if(geomList.get(0).getSRID()==geomList.get(1).getSRID()) {
            int []state={0};
            boolean retBool=isInteraction(geomList.get(0), geomList.get(1),state);
            retJson.put("state", state);//返回0 1 2 3 ，0代表相离，1代表相交，2代表重合，3代表包含
            if(retBool) {
                double interactionArea=getIntersectionArea(geomList.get(0),geomList.get(1),state);
                double proporationA=proportionOfArea(geomList.get(0),interactionArea);
                double proporationB=proportionOfArea(geomList.get(1),interactionArea);
                retJson.put("proporationA",proporationA );
                retJson.put("proporationB",proporationB );
            }else {
                retJson.put("proporationA",0 );
                retJson.put("proporationB",0 );
            }
            
        }else {
            retJson.put("Error", "数据坐标系不一致，无法判断");
        }
        
        return retJson;
    }
    
    
    //判断多边形A和多边形B是否相交
    public static boolean isInteraction(Geometry polygonA,Geometry polygonB,int[]state){
        boolean retBool=false;
        //判断多边形A和多边形B的坐标系是否一致，如果不一致无法进行判断
        if(polygonA.getSRID()== polygonB.getSRID()){		//首先判断坐标系是否一致
            state[0]=1;
            retBool = polygonA.intersects(polygonB);	//其次通过intersects判断polygonA和polygonB是否相交
            if(polygonA.contains(polygonB)){			//其中相交还包括polygonA是否包含polygonB
                if(polygonA.getArea()==polygonB.getArea()){			//同时如果polygonA和polygonB的面积相等，等于说A和B重合
                    System.out.println("多边形A和多边形B重合");
                    state[0]=2;
                }else{												//否则只是包含关系
                    System.out.println("多边形A包含多边形B");
                    state[0]=3;
                }
            }else if(polygonB.contains(polygonA)){
                if(polygonA.getArea()==polygonB.getArea()){
                    System.out.println("多边形A和多边形B重合");
                    state[0]=2;
                }else{
                    System.out.println("多边形B包含多边形A");
                    state[0]=3;
                }
            }
        }else{
            System.out.println("坐标系不相同，无法判断！");
        }
        return retBool;
    }
    
    //判断是否为矩形和多边形
    public static boolean isPolygon(Geometry polygon){
        return polygon instanceof Polygon || polygon instanceof MultiPolygon;
    }
    
    //通过polygon获取相交面积的比例
    public static double proportionOfArea(Geometry polygon,double intersectionArea){
        double retArea=0.0;
        if(isPolygon(polygon)&&intersectionArea!=0){
            retArea=intersectionArea/polygon.getArea();
        }
        return retArea;
        
    }
    
    //返回多边形A和多边形B的相交面积 //getIntersectionArea (a);
    
    public static double getIntersectionArea(Geometry polygonA,Geometry polygonB,int []state){
        double retArea=0.0;

        if(isPolygon(polygonA)&&isPolygon(polygonB)){
            if(isInteraction(polygonA,polygonB,state)){
                Geometry intersection = polygonA.intersection(polygonB);
                retArea=intersection.getArea();
            }
        }
        return retArea;
    }
}
