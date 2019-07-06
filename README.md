# WebGISDemo
WebGIS练习项目,技术栈是Vue,Openlayers

## 访问
[点击跳转](https://soitwaterdemos.github.io/WebGISDemo/dist)

## 简介
- ui  
  Element-ui
- 地图  
  Openlayers5
- 功能
  * 涂鸦
  * 填充
  * 标记
  * 查看属性
  * 上传文件
    - 支持`*.json`以及`*.zip`
    - `*.zip`为shapefile压缩后文件(且外层无文件夹包裹)
    - 上传文件后将统一转换为`*.json`格式并展示
    - 若上传`*.zip`格式的地图文件, 上传后均可下载到本地, 所下载的文件格式为`*.json`
    - 网页中提供了一份`testdata.zip`示例数据, 可供参考