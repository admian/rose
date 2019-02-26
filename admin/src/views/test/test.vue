<template>
  <div class="wrap">

    <el-upload
      class="upload-demo"
      drag
      action="https://file.niyouxi77.com/files/upload"
      :on-success="upSuccessDreamDetai"
      :data="data"
      multiple
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>


    <el-button class="filter-item" type="primary" icon="el-icon-download" @click="uploads()">上传</el-button>


    <el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>

    <div v-for="i,index in fileList" :key="index" class="item">
      文件名：{{i.name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{i.url}} <img :src="i.url"/>
    </div>
    <el-select
      v-model="value4"
      multiple
      collapse-tags
      style="margin-left: 20px;"
      placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>

  </div>

</template>

<script>
  import { upLoad } from '@/api/upLoad'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  let formData = new FormData()
  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    data() {
      return {
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value4: [],
        test:{},



        data:{key:'abc'},
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          beginTime: undefined,
          endTime: undefined,
          registType: ''
        },
        downloadLoading: false,
        valueDate:'',
        fileList:[],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        blackList(this.listQuery).then(response => {
          this.list = response.items
          this.total = response.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNo = 1
        this.getList()
      },
      upSuccessDreamDetai(res, file, fileList){
        this.fileList.push({name:file.name,url:res.url})
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['文件名','链接']
          const filterVal = ['name', 'url']
          const data = this.formatJson(filterVal, this.fileList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '上传文件列表'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'addTime') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      remove(userId,cell){
        const index = cell.$index
        this.$confirm('确定将该用户移除黑名单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeBlack({userId}).then( () =>{
            this.list.splice(index,1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      blur() {
        if(!this.valueDate){
          this.listQuery.beginTime = null
          this.listQuery.endTime = null
        }else{
          this.listQuery.beginTime = this.valueDate[0]
          this.listQuery.endTime = this.valueDate[1]
        }
      }
    }
  }
</script>
<style>
  .el-upload-list--text{display: none}
</style>
<style scoped>
  .wrap{
    margin:50px auto;
    width: 60%;
  }
  .item{
    margin-bottom: 10px;
  }
  img{
    width: 50px;
    height: 50px;
  }

</style>
