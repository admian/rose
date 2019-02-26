<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.labelsTypeId" placeholder="请选择" >
        <el-option
          v-for="item in listQueryLabelsList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <el-input :placeholder="'标签类型/标签名字'" v-model="listQuery.key" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增标签</el-button>
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
      <el-table-column :label="'标签名字'" align="labelsName" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.labelsName}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'标签类型'" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.labelsTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'标签说明'" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'主题背景'" width="140px" align="center">
        <template slot-scope="scope">
          <img class="headPic" :src="'https://file.niyouxi77.com/'+scope.row.themePic"/>
        </template>
      </el-table-column>
      <el-table-column :label="'时间'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fcd | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'权重'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orders}}</span>
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
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog title="新增标签" :visible.sync="dialogFormVisible" @close="close">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'标签名字'">
          <el-input v-model="temp.labelsName"  placeholder="Please input"/>
        </el-form-item>
        <el-form-item :label="'标签类型'" prop="dreamCover">
          <el-select v-model="temp.labelsType" placeholder="请选择">
            <el-option
              v-for="item in labelsList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item :label="'标签说明'">
          <el-input v-model="temp.description"  placeholder="Please input"/>
        </el-form-item>
        <el-form-item :label="'主题背景'">
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
  import { contentTagList, contentTagAdd, labelsType, contentTagChange } from '@/api/content'
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
          key:null,
          labelsTypeId:null
        },
        listQueryLabelsList:[{name:'全部',id:''}],
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
          labelsName: null,
          description: null,
          themePic: null,
          enable: 1,
          orders: 0,
          labelsType:''

        },
        scope:null
      }
    },
    created() {
      this.getList();
      labelsType().then( res => {
        this.listQueryLabelsList.push(...res)
        this.labelsList = res
      })
    },
    methods: {
      getList() {
        this.listLoading = true
        contentTagList(this.listQuery).then(response => {
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
          labelsName: null,
          description: null,
          themePic: null,
          enable: 1,
          orders: 0,
          labelsType:''
        }
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
        this.temp.themePic = res.path
      },
      changeTag(scope){
        let _this = this;
        scope.labelsType = parseInt(scope.labelsTypeId)
        this.temp = Object.assign({}, scope)

        console.log(this.temp)

        /*
                this.labelsList.map(function(i) {
                  if(i.name == _this.temp.labelsTypeName){
                    _this.temp.labelsType = i.id
                  }
                })
        */
        this.scope = scope
        this.themeBgList = [{name:'主题背景',url:'https://file.niyouxi77.com/'+scope.themePic,path:scope.themePic}]
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData(){
        contentTagAdd(this.temp).then( () => {
          const _this = this;
          this.labelsList.map(function(i) {
            if(i.id == _this.temp.labelsType){
              _this.temp.labelsTypeName = i.name
            }
          })
          this.temp.fcd =  Date.parse(new Date())
          this.list.unshift(this.temp)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            //const tempData = Object.assign({}, this.temp)
            this.temp.labelsId = this.temp.id
            let _this = this

            this.temp.themePic = this.themeBgList[0].path
            contentTagChange(this.temp).then(() => {
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
