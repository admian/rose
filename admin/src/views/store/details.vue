<template>
  <el-card class="box-card" v-if="!!info">
    <div class="wrap">
      <div class="content">
        《{{info.storyName}}》
      </div>
      {{info.storyBody}}
    </div>
  </el-card>
</template>

<script>
import { storedet } from '@/api/store'
export default {
  name: 'Details',
  data() {
    return {
      info:null
    }
  },
  methods:{
    getData(storyId){
      storedet({storyId}).then( res => {
        this.info = res
      })
    }
  },
  created(){
    this.getData(this.$route.query.id)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .wrap{
    padding:0 50px;
    .content{
      margin-bottom: 30px;
    }
  }
</style>
