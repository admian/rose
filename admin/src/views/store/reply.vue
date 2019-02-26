<template>
  <div class="app-container">
    <div class="filter-container">
      <h3>{{comment.storyName}}</h3>
      <p>{{comment.userName}}</p>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="comment.items"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="'评论人 / 时间'" prop="id" align="center" width="140">
        <template slot-scope="scope">
          <p>{{ scope.row.userName }}</p>
          <p>{{ scope.row. replyDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</p>
        </template>
      </el-table-column>
      <el-table-column :label="'内容'" width="340px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.replyBody }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'状态'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.enable == 0 ? '屏蔽' : '显示' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="changeCommentState(scope)">{{scope.row.enable == 1 ? '屏蔽' : '显示'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
  import { storeReplyList, storeReplyState } from '@/api/store'
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
        id:null,
        list: null,
        total: 0,
        listLoading: true,
        comment:{},
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          evaluateId:null,
          beginTime: undefined,
          endTime: undefined,
          registType: ''
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        }
      }
    },
    created() {
      this.listQuery.evaluateId = this.$route.query.id;
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        storeReplyList(this.listQuery).then(res => {
          this.comment = res;
          this.total = res.total;
          this.listLoading = false
        })
      },


      // 设置评论状态
      changeCommentState(scope){
        const replyId = scope.row.evaluateReplyId;
        let enable = scope.row.enable;
        enable = enable == 0 ? 1 : 0;
        let txt = enable == 1 ? '显示' : '屏蔽'
        this.$confirm('此操作将'+txt+'此回复, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          storeReplyState({replyId,enable}).then( ()=> {
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

      handleFilter() {
        this.listQuery.pageNo = 1
        this.getList()
      },

      blur() {
        console.log(this.valueDate)
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .fixed-width .el-button--mini{
    width: auto;
  }
</style>
