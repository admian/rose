<template>
  <div class="app-container">
    <el-table
      :data="list"
      :key="tableKey"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="'违规用户ID'" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'违规者昵称'" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'链接地址'" align="center">
        <template slot-scope="scope">
          <a class="link" :href="scope.row.linkUrl" target="_blank" @click="showVideoDia(scope.row)">{{scope.row.videoUrl}}</a>
        </template>
      </el-table-column>
      <el-table-column :label="'举报描述'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'状态'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.enable == 1 ? '开启' : '禁用'}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="200" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button round size="mini" @click="remove(scope)">{{ scope.row.enable == 0 ? '开启' : '禁用'}}</el-button>
              </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

    <el-dialog
      title="作品视频"
      :visible.sync="showPicDia"
    >
      <video class="diaVideo" controls :src="videoUrl"></video>
    </el-dialog>


  </div>

</template>

<script>
  import { reportList, worksEnable } from '@/api/auditing'
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
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNo: 1,
          pageSize: 20
        },
        showPicDia: false,
        videoUrl: null,
        downloadLoading: false,
        valueDate: '',
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
        reportList(this.listQuery).then(response => {
          this.list = response.items
          this.total = response.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNo = 1
        this.getList()
      },
      showVideoDia(scope){
        this.showPicDia = true
        this.videoUrl = scope.videoUrl
      },
      remove(scope){
        const productionId = scope.row.channelItemId;
        const index = scope.$index;
        let enable = scope.row.enable == 0 ? 1 : 0;
        this.$confirm('确定更改作品状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          worksEnable({productionId,enable}).then( () =>{
            this.$message({
              type: 'success',
              message: '更改成功!'
            });
            scope.row.enable = enable
            this.list[index].enable = enable;
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消!'
          });
        });
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .fixed-width .el-button--mini {
    width: auto;
  }

  .link {
    color: #409EFF
  }

  .pic {
    width: 60px;
    height: 60px;
    margin-left: 5px;
  }
  .dia-pic{
    max-width: 70%;
  }
  .diaVideo{
    display: block;
    width: 70%;
    margin: 0 auto;
  }
</style>
