<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import request from '@/utils/request'
export default{
  name: 'App'
}
</script>
<style>
  .clearfix:after {
    content:"";
    display: block;
    clear:both;
  }
  .el-date-editor .el-range-separator{
    width: auto!important;
  }
  .el-select{
    vertical-align: middle;
    margin-bottom: 10px;
  }
  .date-picker{
    vertical-align: middle;
    margin-bottom: 10px;
  }
  .headPic{
    height: 50px;
    width:50px;
  }
  .el-tag{
    margin-right: 5px;
  }
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
