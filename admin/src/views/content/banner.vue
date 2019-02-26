<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">新增banner
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
      <el-table-column :label="'广告ID'" prop="id" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'广告类型'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'图片'" width="110px" align="center">
        <template slot-scope="scope">
          <img class="headPic" :src="'https://file.niyouxi77.com/'+scope.row.imageUrl">
        </template>
      </el-table-column>
      <el-table-column :label="'广告频道'" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channelName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'作品'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productionName ? scope.row.productionName : '----' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'权重'" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orders }}</span>
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

    <el-dialog title="banner" :visible.sync="dialogFormVisible" @close="close">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px"
               style="width: 400px; margin-left:50px;">
        <el-form-item :label="'图片'" prop="type">
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
        <el-form-item :label="'频道'" prop="type">
          <el-select v-model="temp.channelId" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.name"
                       :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="'作品'" prop="type" v-if="temp.channelId">
          <el-select
            v-model="temp.productionName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="loading"
            clearable>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
<!--
          <el-input
            placeholder="请输入作品ID"
            type="text"
            v-model="temp.channelItemId"
            @keyup.native="channelItem"
            clearable>
          </el-input>
-->
        </el-form-item>
        <el-form-item :label="'描述'" prop="type">
          <el-input v-model="temp.description">

          </el-input>
        </el-form-item>
        <el-form-item :label="'权重'" prop="type">
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
import { bannerList, bannerChange, bannerDel, bannerAdd } from '@/api/content'
import { worksList } from '@/api/works'
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
      data:{key:'abc'},
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
      },
      workListQuery: {
        pageNo: 1,
        pageSize: 20,
      },
      options:[],
      loading:false,
      bannerId:null,
      banner:[],
      temp: {
        imageUrl: null,
        description: '',
        channelId: '',
        orders:'0',
        channelItemId:null,
        productionName:null,

      },
      dialogFormVisible: false,
      dialogStatus: '',
      calendarTypeOptions:[
        {name:'演艺',key:1},
        {name:'配音',key:2},
        {name:'即兴',key:3},
        {name:'故事',key:4},
        {name:'梦想',key:5},
      ],
      scope:null
    }

  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      bannerList(this.listQuery).then(res => {
        this.list = res.items
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
        this.loading = true;
        let obj = this.workListQuery;
        obj.key = query;
        obj.channelId = this.temp.channelId;
        worksList(obj).then( res => {
          this.loading = false;
          this.options = res.items
        })
      } else {
        this.options = [];
      }
    },
    handleModifyStatus(scope) {
      const index = scope.$index;
      const bannerId = scope.row.id
      this.$confirm('此操作将删除广告, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        bannerDel({bannerId}).then( ()=> {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.list.splice(index,1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        });
      });

    },
    resetTemp() {
      this.temp = {
        imageUrl: null,
        description: '',
        channelId: '',
        orders:'0',
        channelItemId:null,
        productionName:null

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
          this.temp.imageUrl = this.banner[0].path
          this.temp.channelItemId = this.temp.productionName

          bannerAdd(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
            setTimeout(function() {
              location.reload()
            },1000)
          })
        }
      })
    },
    handleImageSuccess(res,file){
      this.banner = [
        {name:file.name,url:res.url,path:res.path}
      ]
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.banner = [
        {name:'banner',url:'https://file.niyouxi77.com/'+row.imageUrl,path:row.imageUrl}
      ]
      this.scope = row;
      let channelId = '';
      if(row.channelName == '演艺'){
        channelId = 1;
      }else if (row.channelName == '配音'){
        channelId = 2;
      }else if (row.channelName == '即兴'){
        channelId = 3;
      }else if (row.channelName == '故事'){
        channelId = 4;
      }else if (row.channelName == '梦想'){
        channelId = 5;
      }
      this.temp.bannerId = row.id
      this.temp.imageUrl = row.imageUrl
      this.temp.channelId = channelId
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    close(){
      this.banner = []
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const _this = this
          const tempData = Object.assign({}, this.temp)
          tempData.imageUrl = this.banner[0].path
          tempData.channelItemId = tempData.productionName
          bannerChange(tempData).then(() => {
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
