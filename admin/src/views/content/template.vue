<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">新增模板
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column :label="'模板类型'" prop="id" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.templateName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'模板内容'" align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.templateType == 5" :src="'https://file.niyouxi77.com/'+scope.row.templateValue"
               class="headPic">
          <span v-else-if="scope.row.templateType == 3">
            {{ scope.row.labelsName }}
          </span>
          <span v-else>{{ scope.row.templateValue }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="'操作'" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" @click="handleModifyStatus(scope)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

    <el-dialog title="模板" :visible.sync="dialogFormVisible" @close="close">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px"
               style="width: 400px; margin-left:50px;">
        <el-form-item :label="'模板类型'" prop="type">
          <el-select v-model="temp.templateType" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.name"
                       :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="'图片'" prop="type" v-if="temp.templateType == 5">
          <el-upload
            class="upload-demo"
            action="https://file.niyouxi77.com/files/upload"
            :data="data"
            :limit="1"
            :on-success="handleImageSuccess"
            :file-list="banner"
            list-type="picture">
            <el-button size="small" type="primary" @click="fileIndex='dreamDetail' ">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item :label="'模板内容'" prop="type">
          <el-select v-model="temp.templateValue" placeholder="请选择" v-if="temp.templateType == 3">
            <el-option-group
              v-for="group in labelList"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.id"
                :label="item.labelsName"
                :value="item.id">
              </el-option>
            </el-option-group>
          </el-select>
          <el-input v-else v-model="temp.templateValue" :disabled="temp.templateType == 5">
          </el-input>
        </el-form-item>
        <el-form-item :label="'描述'" prop="type">
          <el-input v-model="temp.templateDescription" placeholder="可为空">
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
  import { templateList, templateAdd, templateDel, templateChange } from '@/api/template'
  import { contentTagList } from '@/api/content'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        data: { key: 'abc' },
        total: 0,
        listLoading: true,
        listQuery: {
          pageNo: 1,
          pageSize: 20
        },
        workListQuery: {
          pageNo: 1,
          pageSize: 20
        },
        options: [],
        loading: false,
        bannerId: null,
        banner: [],
        labelList: [],
        temp: {
          id: null,
          templateDescription: null,
          templateType: null,
          templateValue: null,
          labelsName: null

        },
        dialogFormVisible: false,
        dialogStatus: '',
        calendarTypeOptions: [
          { name: '用户昵称', key: 1 },
          { name: '艺术取向', key: 2 },
          { name: '演艺标签', key: 3 },
          { name: '个性签名', key: 4 },
          { name: '头像', key: 5 }
        ],
        scope: null
      }

    },
    created() {
      this.getList()
      this.getTable()

    },
    methods: {
      getTable() {
        const _this = this;
        let ids = [
          { name: '性格标签',id:1 },
          { name: '星座年代',id:2 },
          { name: '派别标签',id:3 }
          ]
        ids.forEach(function(i) {
          let obj = {
            label:null,
            options:[]
          };
          contentTagList({ labelsTypeId: i.id,pageNo:1,pageSize:100 }).then(res => {
            obj.label = i.name;
            obj.options = res.items;
            _this.labelList.push(obj);
          })
        })
      },
      getList() {
        this.listLoading = true
        templateList(this.listQuery).then(res => {
          this.list = res.list
          this.total = res.total
          this.listLoading = false

        })
      },
      handleFilter() {
        this.listQuery.pageNo = 1
        this.getList()
      },
      /*    channelItem(event){
            this.temp.channelItemId = event.target.value.replace(/\D/g,'')
          },*/
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true
          let obj = this.workListQuery
          obj.key = query
          obj.channelId = this.temp.channelId
          worksList(obj).then(res => {
            this.loading = false
            this.options = res.items
          })
        } else {
          this.options = []
        }
      },
      handleModifyStatus(scope) {
        const index = scope.$index
        const bannerId = scope.row.id
        this.$confirm('此操作将删除广告, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          templateDel(bannerId).then(() => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.list.splice(index, 1)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          })
        })

      },
      resetTemp() {
        this.temp = {
          id: null,
          templateDescription: null,
          templateType: null,
          templateValue: null,
          labelsName: null

        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(this.temp)
            templateAdd(this.temp).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
          }
        })
      },
      handleImageSuccess(res, file) {
        this.banner = [
          { name: file.name, url: res.url, path: res.path }
        ]
        this.templateValue = res.path
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj

        this.banner = this.temp.templateType == 5 ? [
          { name: '头像', url: 'https://file.niyouxi77.com/' + row.templateValue, path: row.templateValue }
        ] : []
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      close() {
        this.banner = []
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const _this = this
            const tempData = Object.assign({}, this.temp)
            templateChange(tempData).then(() => {
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
      }

    }
  }
</script>
