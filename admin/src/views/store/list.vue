<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="'故事标题 / 昵称'" v-model="listQuery.key" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        class="date-picker"
        v-model="valueDate"
        value-format="yyyy-MM-dd hh:mm:ss"
        type="daterange"
        time-arrow-control
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions" @change="blur"
      >
      </el-date-picker>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table
      :data="list"
      :key="tableKey"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="'用户ID'" prop="userId" align="center" width="80"></el-table-column>
      <el-table-column :label="'用户头像'" width="80px" align="center">
        <template slot-scope="scope">
          <img class="headPic" :src="'https://file.niyouxi77.com/'+scope.row.headUrl" />
        </template>
      </el-table-column>
      <el-table-column :label="'用户昵称'" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'发布时间'" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.publishTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'故事标题'" width="130px">
        <template slot-scope="scope">
          <span>{{scope.row.storyTitleName}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="'题材类型'" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.storyTypeName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="'喜欢'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.love}}</span>
        </template>
      </el-table-column>

      <el-table-column :label="'状态'" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.enable ? '已发布' :'待审核' }}</span>
        </template>
      </el-table-column>



      <el-table-column :label="'操作'" align="center" width="400" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button round size="mini" @click="checkStore(scope.row.id)">故事详情</el-button>
          <el-button round size="mini" @click="handleConfirm(scope)">{{ scope.row.enable ? '下架' :'发布' }}</el-button>
          <el-button round size="mini" @click="checkCommentList(scope.row.id)">查看评论</el-button>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
  import { storeList, storeEnable } from '@/api/store'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    data() {
      return {
        tableKey: 0,
        list: [],
        total: 0,
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          beginTime: undefined,
          endTime: undefined,
          key: ''
        },
        valueDate:'',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        downloadLoading:false,
        loading:false,
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.loading = true
        storeList(this.listQuery).then(res => {
          this.list=res.items
          this.total = res.total
          this.loading = false
        })
      },

      // 故事详情跳转
      checkStore(id){
        this.$router.push({path:'/store/details?id='+id})
      },
      // 故事详情跳转
      checkCommentList(id){
        this.$router.push({path:'/store/comment?id='+id})
      },

      // 发布 下架
      handleConfirm(scope){
        const storyId = scope.row.id;
        let enable = scope.row.enable;
        enable = enable == 0 ? 1 : 0;
        let txt = enable == 1 ? '发布' : '下架'
        this.$confirm('此操作将'+txt+'故事, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          storeEnable({storyId,enable}).then( ()=> {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            scope.row.enable = enable
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });
        });
      },

      // 分页
      handleFilter() {
        this.listQuery.pageNo = 1
        this.getList()
      },

      // 导出excel
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['用户ID','用户头像', '用户昵称', '发布时间', '故事标题', '呈现方式---暂时没有','题材类型','喜欢','展示权重','状态']
          const filterVal = ['id', 'headUrl', 'nickName', 'publishTime', 'storyTitleName', '暂时没有', 'storyTypeName', 'love','orders','enable']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '故事列表'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'publishTime') {
            return parseTime(v[j])
          }else if(j == 'enable'){
            return v[j] ? '已发布' :'待审核'
          } else {
            return v[j]
          }
        }))
      },

      // 时间选择
      blur() {
        if(!this.valueDate){
          this.listQuery.beginTime = null
          this.listQuery.endTime = null
        }else{
          this.listQuery.beginTime = this.valueDate[0]
          this.listQuery.endTime = this.valueDate[1]
        }
      },

      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      }

    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .popup{
    .input_item{
      margin-bottom: 10px;
    }
    .btn_wrap{
      width: max-content;
      margin:0 auto;
    }
  }
  .popup_list{
    list-style-type:none;
    font-size: 14px;
    li{
      padding:10px 0;
      span{
        color:#333;
      }
    }
  }
   .fixed-width .el-button--mini{
     width: auto;
   }

  .fixed-width .el-button--mini{
    width: auto;
  }
</style>
