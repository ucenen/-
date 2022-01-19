<!--
  描述：高德地图组件，默认尺寸是 500 * 300

  接收属性参数：
    lat: 纬度
    lng: 经度

  示例：
    <amap></amap>
-->
<template>
  <div class="m-map">
    <el-row>
        <el-col :span="21">
            <el-input id="txtSearchKey" placeholder="请输入关键字查询，然后选择正确地址" maxlength="280" v-model="addr" />
        </el-col>
        <el-col :span="2">
            <el-button type="success" size="small" @click="handleLocation" style="margin-left:2px;">确认定位</el-button>
        </el-col>
    </el-row>
    <div class="info" id="divInfo" style="display:none;">
        <el-input id="txtLnglat" v-model="resLngLat"  disabled="" type="text" size="mini">
          <template slot="prepend">经纬度</template>
        </el-input>
    </div>
    <div id="js-container" class="map">正在加载数据 ...</div>
  </div>
</template>

<script>
import remoteLoad from '@/utils/remoteLoad.js'
import { MapKey, MapCityName } from './mapConfig.js'
import { Message } from 'element-ui'
export default {
  props: ['lat', 'lng', 'form'],
  data () {
    return {
      searchKey: '',
      AMap: null,
      resLngLat: '',
      addr: ''
    }
  },
  methods: {
    handleLocation() {
        this.resLngLat = AMap.map.resLngLat;
        if(!AMap.map.resLngLat) {
            //console.log(this.addr);
            Message({
              message: '请先输入地址',
              type: 'warning',
              duration: 3 * 1000
            })
            return;
        }
        
        this.form.address = AMap.map.formattedAddress;
        this.form.longitude = AMap.map.longitude;
        this.form.latitude = AMap.map.latitude;
        this.$emit('cancelMap');
    },
    // 搜索
    handleSearch() {
      if(AMap.map.marker) {
        AMap.map.remove(AMap.map.marker);
      }
      AMap.map.marker = [];
      this.addr = this.form.address;
      if(this.form.latitude && this.form.longitude) {
        AMap.map.resLngLat = this.form.longitude + ',' + this.form.latitude;
        document.getElementById('txtLnglat').value = AMap.map.resLngLat;
        document.getElementById('divInfo').style.display = 'block';
        document.getElementById('txtLng').value = this.form.longitude;
        document.getElementById('txtLat').value = this.form.latitude;
        AMap.map.longitude = this.form.longitude;
        AMap.map.latitude = this.form.latitude;
        
        var lnglat = [this.form.longitude, this.form.latitude];
        AMap.geocoder.getAddress(lnglat, function(status, result) {
            if (status === 'complete'&& result.regeocode) {
                document.getElementById('txtSearchKey').value = result.regeocode.formattedAddress;
                
                AMap.map.marker.push(new AMap.Marker({
                  position: lnglat
                }));
                AMap.map.add(AMap.map.marker);
                AMap.map.setFitView();
            }else{
              Message({
                message: '根据经纬度查询地址失败',
                type: 'error',
                duration: 3 * 1000
              })
            }
        });
      }
      else if (this.addr) {
        
        if(AMap.map.isloading) {
          return;
        }
        AMap.map.isloading = true;
        AMap.geocoder.getLocation(this.addr, function(status, result) {
            AMap.map.isloading = false;
                        
            if(status === 'complete' && result.info === 'OK' && result.geocodes) {
                //console.log(result);
                if(result.geocodes[0].location) {
                  AMap.map.resLngLat = result.geocodes[0].location.lng + ',' + result.geocodes[0].location.lat;
                  document.getElementById('txtLnglat').value = AMap.map.resLngLat;
                  document.getElementById('divInfo').style.display = 'block';
                  document.getElementById('txtLng').value = result.geocodes[0].location.lng;
                  document.getElementById('txtLat').value = result.geocodes[0].location.lat;
                  AMap.map.longitude = result.geocodes[0].location.lng;
                  AMap.map.latitude = result.geocodes[0].location.lat;
                  if(!document.getElementById('txtAddress').value) {
                    document.getElementById('txtAddress').value = result.geocodes[0].formattedAddress;
                  }
                  AMap.map.formattedAddress = result.geocodes[0].formattedAddress;
            
                  if(!AMap.map.marker) {
                    AMap.map.marker = [];
                  }
                  AMap.map.marker.push(new AMap.Marker({
                    position: [result.geocodes[0].location.lng,result.geocodes[0].location.lat]
                  }));
                  AMap.map.add(AMap.map.marker);
                  AMap.map.setFitView();
                }
            } else {
             Message({
                message: '未找到该地址',
                type: 'error',
                duration: 3 * 1000
              })
            }
        });
      } else {
        if(AMap.map.marker) {            
            document.getElementById('txtLnglat').value = '';
            document.getElementById('divInfo').style.display = 'none';
            document.getElementById('txtLng').value = '';
            document.getElementById('txtLat').value = '';
            AMap.map.longitude = null;
            AMap.map.latitude = null;
            this.initMap();
        }
      }
    },
    // 实例化地图
    initMap () {
      let AMap = this.AMap = window.AMap
        let map = new AMap.Map('js-container')
        AMap.map = map;
        AMap.plugin('AMap.Autocomplete', function(){
          // 实例化Autocomplete
          var autoOptions = {
            city: MapCityName,
            // input 为绑定输入提示功能的input的DOM ID
            input: 'txtSearchKey'
          }
          let autoComplete = new AMap.Autocomplete(autoOptions);
          AMap.autoComplete = autoComplete;
          map.addControl(autoComplete);
        })
        AMap.autoComplete.on('select', function(selResult) {
          //选中搜索结果
          if(selResult && selResult.poi && selResult.poi.location) {
              if(AMap.map.marker) {
                  AMap.map.remove(AMap.map.marker);
                  AMap.map.marker = [];
              }
              AMap.map.resLngLat = selResult.poi.location.lng + ',' + selResult.poi.location.lat;
              document.getElementById('txtLnglat').value = AMap.map.resLngLat;
              document.getElementById('divInfo').style.display = 'block';
              document.getElementById('txtLng').value = selResult.poi.location.lng;
              document.getElementById('txtLat').value = selResult.poi.location.lat;
              AMap.map.longitude = selResult.poi.location.lng;
              AMap.map.latitude = selResult.poi.location.lat;
              
              this.searchKey = (selResult.poi.district?selResult.poi.district:'') + selResult.poi.name;
              if(!document.getElementById('txtAddress').value) {
                document.getElementById('txtAddress').value = this.searchKey;
              }
              AMap.map.formattedAddress = this.searchKey;
        
              if(!AMap.map.marker) {
                AMap.map.marker = [];
              }
              AMap.map.marker.push(new AMap.Marker({
                position: [selResult.poi.location.lng,selResult.poi.location.lat]
              }));
              AMap.map.add(AMap.map.marker);
              AMap.map.setFitView();
              return;
          }  
          
          if(selResult && selResult.poi && selResult.poi.name) {
            this.searchKey = (selResult.poi.district?selResult.poi.district:'') + selResult.poi.name;
            
            if(AMap.map.isloading) {
              return;
            }
            AMap.map.isloading = true;
            AMap.geocoder.getLocation(this.searchKey, function(status, result) {
                AMap.map.isloading = false;
                if(AMap.map.marker) {
                    AMap.map.remove(AMap.map.marker);
                    AMap.map.marker = [];
                }
                
                if(status === 'complete' && result.info === 'OK' && result.geocodes) {
                    if(result.geocodes[0].location) {
                      AMap.map.resLngLat = result.geocodes[0].location.lng + ',' + result.geocodes[0].location.lat;
                      document.getElementById('txtLnglat').value = AMap.map.resLngLat;
                      document.getElementById('divInfo').style.display = 'block';
                      document.getElementById('txtLng').value = result.geocodes[0].location.lng;
                      document.getElementById('txtLat').value = result.geocodes[0].location.lat;
                      AMap.map.longitude = result.geocodes[0].location.lng;
                      AMap.map.latitude = result.geocodes[0].location.lat;
                      if(!document.getElementById('txtAddress').value) {
                        document.getElementById('txtAddress').value = result.geocodes[0].formattedAddress;
                      }
                      AMap.map.formattedAddress = result.geocodes[0].formattedAddress;
                
                      if(!AMap.map.marker) {
                        AMap.map.marker = [];
                      }
                      AMap.map.marker.push(new AMap.Marker({
                        position: [result.geocodes[0].location.lng,result.geocodes[0].location.lat]
                      }));
                      AMap.map.add(AMap.map.marker);
                      AMap.map.setFitView();
                    }
                } else {
                 Message({
                    message: '未找到该地址',
                    type: 'error',
                    duration: 3 * 1000
                  })
                }
            });
          }
        })
        
        AMap.plugin(['AMap.Geocoder'], function () {
          let geocoder = new AMap.Geocoder({
            city: MapCityName
          });
          map.addControl(geocoder);
          AMap.geocoder = geocoder;
        })
        // 启用工具条 
        AMap.plugin(['AMap.ToolBar'], function () {
          map.addControl(new AMap.ToolBar({
            position: 'RB'
          }))
        })
    }
  },
  async created () {
    // 已载入高德地图API，则直接初始化地图
    if (window.AMap) {
      this.initMap()
    // 未载入高德地图API，则先载入API再初始化
    } else {
      await remoteLoad(`http://webapi.amap.com/maps?v=1.4.15&key=${MapKey}`)
      this.initMap()
    }
  }
}
</script>

<style lang="css">
.m-map{ min-width: 500px; height: 300px; position: relative; }
.m-map .map{ width: 100%; height: 100%; }
.m-map .result{ max-height: 300px; overflow: auto; margin-top: 1px; }
.amap-sug-result {z-index:2048!important}

.info {
    padding: .2rem;
    margin-bottom: 1rem;
    border-radius: .25rem;
    position: absolute;
    top: 2.5rem;
    z-index: 1;
    background-color: white;
    width: auto;
    min-width: 12rem;
    border-width: 0;
    right: 1rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
}
.m-map .el-input-group__prepend {
    background-color: #e9ecef
}
</style>
