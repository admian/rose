<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增类型</el-button>
    </div>
    <el-table
      :data="list"
      :key="tableKey"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="'作品类型名字'" align="labelsName" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'作品类型说明'" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'主题背景'" width="140px" align="center">
        <template slot-scope="scope">
          <img class="headPic" :src="'https://file.niyouxi77.com/'+scope.row.productionTypeCover"/>
        </template>
      </el-table-column>
      <el-table-column :label="'频道'" width="140px" align="center">
        <template slot-scope="scope">
          {{calendarTypeOptions[(scope.row.channelId - 1)].name}}
        </template>
      </el-table-column>
      <el-table-column :label="'权重'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orders}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'状态'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.enable == 1 ? '展示' : '关闭' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button round size="mini" @click="changeTag(scope.row)">编辑</el-button>
          <el-button round size="mini" @click="handleModifyStatus(scope)">{{ scope.row.enable == 1 ? '关闭' : '展示' }}
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog title="新增标签" :visible.sync="dialogFormVisible" @close="close">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'作品类型名字'">
          <el-input v-model="temp.name"  placeholder="Please input"/>
        </el-form-item>
        <el-form-item :label="'频道'" prop="type">
          <el-select v-model="temp.channelId" class="filter-item" placeholder="请选择">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.name"
                       :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="'标签说明'">
          <el-input v-model="temp.description"  placeholder="Please input"/>
        </el-form-item>
        <el-form-item :label="'背景'">
          <el-upload
            class="upload-demo"
            action="https://file.niyouxi77.com/files/upload"
            :limit="1"
            :data="data"
            :on-success="upSuccess"
            :file-list="themeBgList"
            list-type="picture">
            <el-button size="small" type="primary" @click="fileIndex='dreamDetail' ">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item :label="'权重'">
          <el-input
            placeholder="请输入内容"
            type="number"
            v-model="temp.orders"
            maxlength="2"
            clearable>
          </el-input>
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
  import { proTypeList, proEnable, proModify ,proAdd } from '@/api/productionType'
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
        calendarTypeOptions:[
          {name:'演艺',key:1},
          {name:'配音',key:2},
          {name:'即兴',key:3},
          {name:'故事',key:4},
          {name:'梦想',key:5},
        ],
        labelsList:[],
        dialogFormVisible: false,
        downloadLoading: false,
        dialogStatus:null,
        themeBgList:[],
        valueDate:'',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        data:{key:'abc'},
        temp: {
          id:null,
          channelId: null,
          name: null,
          description: null,
          enable: 0,
          orders: 0,
          productionTypeCover:null
        }
      }
    },
    created() {
      this.getList();
/*
      labelsType().then( res => {
        this.labelsList = res
      })
*/
    },
    methods: {
      getList() {
        this.listLoading = true
        proTypeList(this.listQuery).then(response => {
          this.list = response.list
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
          channelId: null,
          name: null,
          description: null,
          enable: 0,
          orders: 0,
          productionTypeCover:null
        }
      },
      handleModifyStatus(scope) {
        const productionTypeId = scope.row.id
        let enable = scope.row.enable == 0 ? 1 : 0
        this.$confirm('此操作将关闭作品类别, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          proEnable({productionTypeId,enable}).then( ()=> {
            this.dialogFormVisible = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });
        });

      },

      close(){
        this.themeBgList = [];
      },
      handleCreate(){
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      upSuccess(res,file,fileList){
        this.temp.productionTypeCover = res.path
      },
      changeTag(scope){
        this.temp = Object.assign({}, scope)
        this.themeBgList = [{name:'背景',url:'https://file.niyouxi77.com/'+scope.themePic,path:scope.themePic}]
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData(){
        proAdd(this.temp).then( () => {
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            //const tempData = Object.assign({}, this.temp)
            this.temp.productionTypeCover = this.themeBgList[0].path
            proModify(this.temp).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
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
