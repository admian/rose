<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增音乐类型</el-button>
    </div>
    <el-table
      :data="list"
      :key="tableKey"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="'音乐类型'" align="labelsName" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'类型描述'" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'时间'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fcd | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'状态'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.enable == 1 ? '显示':'不显示'}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button round size="mini" @click="changeTag(scope.row)">编辑</el-button>
          <el-button round size="mini" @click="changeState(scope)">{{ scope.row.enable == 1 ? '关闭':'开启'}}</el-button>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog title="新增标签" :visible.sync="dialogFormVisible" @close="close">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'音乐类型'">
          <el-input v-model="temp.name"  placeholder="Please input"/>
        </el-form-item>
        <el-form-item :label="'类型描述'">
          <el-input v-model="temp.description"  placeholder="Please input"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { musicTypeList, changeType, musicTypeAdd, musicTypeEnable } from '@/api/musicType'
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
        dialogFormVisible: false,
        downloadLoading: false,
        dialogStatus:null,
        valueDate:'',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        temp: {
          id:null,
          name: null,
          description: null
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true
        musicTypeList(this.listQuery).then(response => {
          this.list = response.items
          this.total = response.total
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNo = 1
        this.getList()
      },
      resetTemp() {
        this.temp = {
          id:null,
          name: null,
          description: null
        }
      },

      handleCreate(){
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      changeState(scope) {
        const musicId = scope.row.id
        const index = scope.$index
        let enable = scope.row.enable == 0 ? 1 : 0
        this.$confirm('确定更改作品状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          musicTypeEnable({ musicId, enable }).then(() => {
            this.$message({
              type: 'success',
              message: '更改成功!'
            })
            scope.row.enable = enable
            this.list[index].enable = enable
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消!'
          })
        })
      },
      changeTag(scope){
        let _this = this;
        this.temp = Object.assign({}, scope)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData(){
        musicTypeAdd(this.temp).then( () => {
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          this.dialogFormVisible = false
          this.getList();
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            changeType(this.temp).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getList();
            })
          }
        })
      },

    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .fixed-width .el-button--mini{
    width: auto;
  }
</style>
