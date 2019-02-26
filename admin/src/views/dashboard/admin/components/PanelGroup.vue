<template>
  <el-row :gutter="20" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="clearfix">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="works" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">总作品数</div>
            <count-to :start-val="0" :end-val="countInfo.totalProductNum" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
        <div class="det-info">
          <el-row :gutter="5">
            <el-col :span="8">
              <div class="item">
                演艺<span>{{countInfo.fodderNum}}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="item">
                配音<span>{{countInfo.dub}}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="item">
                梦想<span>{{countInfo.dreamNum}}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="card-panel-bot">
          <p>昨日新增作品数 <span class="number">{{countInfo.yesterdayAddProductNum}}</span>环比 <span class="per">{{(countInfo.proRate * 100).toFixed(2) + '%'}}</span></p>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="clearfix">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">注册用户量</div>
            <count-to :start-val="0" :end-val="countInfo.registUserNum" :duration="3000" class="card-panel-num"/>
          </div>
        </div>
        <div class="det-info">
          <el-row :gutter="5">
            <el-col :span="8">
              <div class="item">
                今日新增<span>{{countInfo.todayAddUsers}}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="item">
                启动次数<span>{{countInfo.appStartNum}}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="item">
                日活跃数<span>{{countInfo.activeUsers}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="5">
            <el-col :span="8">
              <div class="item">
                注册留存<span>{{countInfo.regist}}</span>
              </div>
            </el-col>

            <!--
                        <el-col :span="8">
                          <div class="item">
                            次日留存<span>{{countInfo.regist}}</span>
                          </div>
                        </el-col>
                        <el-col :span="8">
                          <div class="item">
                            七日留存<span>120000</span>
                          </div>
                        </el-col>
            -->
          </el-row>
        </div>
        <div class="card-panel-bot">
          <p>昨日新增用户数 <span class="number">{{countInfo.yesterdayAddUsers}}</span>环比 <span class="per">{{(countInfo.userRate * 100).toFixed(2)}}%</span></p>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="clearfix">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="active" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">活动参与总人数</div>
            <count-to :start-val="0" :end-val="countInfo.dreamNum" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
        <div class="det-info">
          &nbsp;
        </div>
        <div class="card-panel-bot">
          <p>昨日参与活动 <span class="number">{{countInfo.yesterdayDreamNum}}</span></p>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="clearfix">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="sucai" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">所有素材数</div>
            <count-to :start-val="0" :end-val="countInfo.totalSource" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
        <div class="det-info">
          &nbsp;
        </div>
        <div class="card-panel-bot">
          <p>开放素材 <span class="number">{{countInfo.openSource}}人</span></p>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props:['countInfo'],
  methods: {

  },created(){

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    -height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 24px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 16px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
    .item{
      padding-bottom: 5px;
      text-align: center;
      font-size: 12px;
      span{
        margin-left: 2px;
        color:#333;
      }
    }
    .det-info{
      min-height: 40px;
    }
    .card-panel-bot{
      border-top: 1px solid #eee;
      padding-left: 15px;
      span{
        margin-left:5px;
        margin-right:20px;
        font-size: 14px;
        color:#000;
      }
    .per{
      color:#f4516c;
      }
    }
  }
}
</style>
