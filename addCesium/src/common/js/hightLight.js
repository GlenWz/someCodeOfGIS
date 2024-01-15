
//const jsonUrl="../../../public/beijing.json"

export function hightLightJson(viewer, Cesium, jsonUrl,jsonName) {
    let highlightedEntity;
    let highlightColor = Cesium.Color.GREEN.withAlpha(0.6);
    let normalColor = Cesium.Color.YELLOW.withAlpha(0.6);

    //一种属性，如果实体当前被鼠标悬停，则返回高亮显示颜色，否则返回默认颜色.
    function createCallback(entity) {
        let colorProperty = new Cesium.CallbackProperty(function (time, result) {
            if (highlightedEntity === entity) {
                return Cesium.Color.clone(highlightColor, result);
            }
            return Cesium.Color.clone(normalColor, result);
        }, false);

        return new Cesium.ColorMaterialProperty(colorProperty);
    }

    //这块写自己的json路径	
    let promise = Cesium.GeoJsonDataSource.load(jsonUrl);// , {            clampToGround: true}
    viewer.dataSources.add(promise);
    //viewer.flyTo(promise);
    promise.then(function (dataSource) {
        viewer.dataSources.add(dataSource);
        dataSource.name=jsonName;
        //获取实体数组
        var entities = dataSource.entities.values;
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            entity.polygon.material = createCallback(entity);
        }
    }).otherwise(function (error) {
        //显示加载时遇到的任何错误.
        window.alert(error);
    });

    let scene = viewer.scene;
    let handler = viewer.screenSpaceEventHandler;
    handler.setInputAction(function (movement) {
        var pickedObject = scene.pick(movement.endPosition);
        if (Cesium.defined(pickedObject) && pickedObject.id instanceof Cesium.Entity) {
            highlightedEntity = pickedObject.id;
        } else {
            highlightedEntity = undefined;
        }

    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    return handler;
}



