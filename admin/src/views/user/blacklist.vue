<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="'用户ID/昵称'" v-model="listQuery.key" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        class="date-picker"
        v-model="valueDate"
        type="daterange"
        time-arrow-control
        value-format="yyyy-MM-dd hh:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions" @change="blur"
      >
      </el-date-picker>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>
    <el-table
      :data="list"
      :key="tableKey"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="'用户ID'" prop="id" align="center" width="160"></el-table-column>
      <el-table-column :label="'用户头像'" width="80px" align="center">
        <template slot-scope="scope">
          <img class="headPic" :src="'https://file.niyouxi77.com/'+scope.row.headUrl" />
        </template>
      </el-table-column>
      <el-table-column :label="'用户昵称'" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'加入时间'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.addTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'备注原因'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button round size="mini" @click="remove(scope.row.id,scope)">移除黑名单</el-button>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { blackList, removeBlack} from '@/api/userInfo'
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
        pageSize: 20,
        beginTime: undefined,
        endTime: undefined,
        key: ''
      },
      downloadLoading: false,
      valueDate:'',
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户ID','用户头像', '用户昵称', '加入时间', '备注原因']
        const filterVal = ['id', 'headUrl', 'nickName', 'addTime', 'description']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '黑名单列表'
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
          this.total --;
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
<style rel="stylesheet/scss" lang="scss" scoped>
  .fixed-width .el-button--mini{
    width: auto;
  }
</style>
