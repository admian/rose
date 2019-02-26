<template>
  <div class="dashboard-editor-container">

    <panel-group :countInfo="info"/>
    <el-row class="tabs" :gutter="20">
      <el-col :span="12">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="所有作品数" name="all"></el-tab-pane>
          <el-tab-pane label="配音作品数" name="2"></el-tab-pane>
          <el-tab-pane label="演艺作品数" name="1"></el-tab-pane>
          <el-tab-pane label="即兴作品数" name="3"></el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="10" style="margin-top: 5px">
        <el-date-picker
          v-model="valueDate"
          type="datetimerange"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd hh:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeDate"
          align="right">
        </el-date-picker>

      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;" :gutter="20">
      <el-col :span="12">
        <bar-chart :signData="signData" :signName="activeName"/>
      </el-col>
      <el-col :span="12">
        <panel-table :topData="topData"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import BarChart from './components/BarChart'
import PanelTable from './components/PanelTable'
import { countInfo, signData, dataTop } from '@/api/index'
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    BarChart,
    PanelTable

  },
  data() {
    return {
      info:{},
      signData:[],
      topData:[],
      channelId:null,
      activeName: 'all',
      activeDate: 'day',
      valueDate:null,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        beginTime: undefined,
        endTime: undefined
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        },
        shortcuts: [
          {
            text: '今日',
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date(new Date().toLocaleDateString()).getTime());
              picker.$emit('pick', [start, end]);
            }
          }, {
          text: '本周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '本月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  watch: {
    info: {
      handler(newValue, oldValue) {

      },
      deep: true
    }
  },
  methods: {
    getDate(){
      countInfo().then( res =>{
        this.info = res;
      });

    },
    getSignData(){
      signData({channelId:this.channelId}).then( res => {
        this.signData = res
      })
    },
    getTop(){
      dataTop(this.listQuery).then( res => {
        this.topData = res.items
      })
    },
    handleClick(tab, event) {
      if(tab.name == 'all'){
        this.channelId = null
      }else{
        this.channelId = tab.name
      }
      this.getSignData()

    },
    changeDate(){
      if(!this.valueDate){
        this.listQuery.beginTime = null
        this.listQuery.endTime = null
      }else{
        this.listQuery.beginTime = this.valueDate[0]
        this.listQuery.endTime = this.valueDate[1]
      }
      this.getTop()
    }
  },
  created(){
    this.getDate();
    this.getSignData();
    this.getTop();
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
  .tabs{
    background-color: #fff;
    padding-left: 20px;
  }
  .el-date-editor--daterange.el-input__inner{
    width: 240px;
  }
  .dateSel{
    margin-top: 8px;
  }
}
</style>
