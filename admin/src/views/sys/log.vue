<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="'操作人'" v-model="listQuery.key" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        class="date-picker"
        v-model="valueDate"
        type="daterange"
        time-arrow-control
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd hh:mm:ss"
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
      <el-table-column :label="'流水号'" prop="id" align="center" width="100"></el-table-column>
      <el-table-column :label="'操作人'" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.operator}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作时间'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.addTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'ip地址'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'所在模块'" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <span>{{scope.row.model}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'内容'" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
  import { logList } from '@/api/sys'
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
          key: null
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
        logList(this.listQuery).then(response => {
          this.list = response.items
          this.total = response.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNo = 1
        this.getList()
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
<style rel="stylesheet/scss" lang="scss" scoped>
  .fixed-width .el-button--mini{
    width: auto;
  }
</style>
