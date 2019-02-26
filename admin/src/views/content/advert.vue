<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">新增广告
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
      <el-table-column :label="'广告名称'" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'广告说明'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'开始时间'" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'结束时间'" width="140" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'图片'" width="110px" align="center">
        <template slot-scope="scope">
          <img class="headPic" :src="'https://file.niyouxi77.com/'+scope.row.advertCover">
        </template>
      </el-table-column>
      <el-table-column :label="'链接地址'" width="140px" align="center">
        <template slot-scope="scope">
          {{scope.row.advertUrl}}
        </template>
      </el-table-column>
      <el-table-column :label="'广告位置'" width="140px" align="center">
        <template slot-scope="scope">
          {{scope.row.localName}}
        </template>
      </el-table-column>

      <el-table-column :label="'状态'" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.enable == 1 ? '展示' : '关闭' }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="'操作'" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" @click="handleModifyStatus(scope)">{{scope.row.enable == 1 ? '关闭' : '展示'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

    <el-dialog title="banner" :visible.sync="dialogFormVisible" @close="close">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="80px"
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
        <el-form-item :label="'类型'" prop="type">
          <el-select v-model="temp.advertType" class="filter-item" placeholder="请选择">
            <el-option v-for="item in typeList" :key="item.key" :label="item.name"
                       :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="'频道'" prop="type" v-if="temp.advertType == 1">
          <el-select v-model="temp.channelId" class="filter-item" placeholder="请选择">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.name"
                       :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="'链接地址'" prop="advertUrl" v-if="temp.advertType == 0">
          <el-input v-model="temp.advertUrl"></el-input>
        </el-form-item>
        <el-form-item :label="'作品ID'" prop="type" v-if="temp.advertType == 1">
          <el-input v-model="temp.channelItemId"></el-input>
        </el-form-item>
        <el-form-item :label="'用户ID'" prop="type" v-if="temp.advertType == 2">
          <el-input v-model="temp.userId"></el-input>
        </el-form-item>
        <el-form-item :label="'位置'" prop="type">
          <el-select v-model="temp.local" class="filter-item" placeholder="请选择">
            <el-option v-for="item in locList" :key="item.id" :label="item.name"
                       :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="'名称'" prop="type">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="'描述'" prop="type">
          <el-input v-model="temp.description">
          </el-input>
        </el-form-item>
        <el-form-item :label="'广告时间'" prop="type">
          <el-date-picker
            class="date-picker"
            v-model="valueDate"
            type="daterange"
            time-arrow-control
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="blur"
          >
          </el-date-picker>
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
import { advertList, advertAdd, advertTypeList, advertLocList, adverEnable, adverModify } from '@/api/advert'
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
      data:{key:'abc'},
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20,

      },
      bannerId:null,
      banner:[],
      typeList:[],
      locList:[],
      temp: {
        advertCover: null,
        advertType: null,
        advertUrl: null,
        channelId: null,
        userId:null,
        channelItemId: null,
        description: null,
        enable: 0,
        local: null,
        name: null,
        endDate: null,
        startDate: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      valueDate:null,
      calendarTypeOptions:[
        {name:'演艺',key:1},
        {name:'配音',key:2},
        {name:'即兴',key:3},
        {name:'故事',key:4},
        {name:'梦想',key:5},
      ],
      scope:null,
    }

  },
  created() {
    this.getList()
    advertTypeList().then( res => {
      this.typeList = res
    })
    advertLocList().then( res => {
      this.locList = res
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      advertList(this.listQuery).then(res => {
        this.list = res.list
        this.total = res.total
        this.listLoading = false

      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleModifyStatus(scope) {
      const index = scope.$index;
      const advertId = scope.row.id
      let enable = scope.row.enable == 0 ? 1 : 0
      this.$confirm('此操作将更改广告状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        adverEnable({advertId,enable}).then( ()=> {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          scope.row.enable = enable
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        });
      });

    },
    resetTemp() {
      this.valueDate = []
      this.temp = {
        advertCover: null,
        advertType: null,
        advertUrl: null,
        channelId: null,
        userId:null,
        channelItemId: null,
        description: null,
        enable: 0,
        local: null,
        name: null,
        endDate: null,
        startDate: null
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
          this.temp.advertCover = this.banner[0].path
          advertAdd(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
            this.getList()
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
        {name:'广告封面',url:'https://file.niyouxi77.com/'+row.imageUrl,path:row.imageUrl}
      ]
      this.valueDate = [new Date(row.startDate), new Date(row.endDate)]
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
          const tempData = Object.assign({}, this.temp)
          this.temp.imageUrl = this.banner[0].path
          adverModify(tempData).then(() => {
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
    blur() {
      if(!this.valueDate){
        this.temp.startDate = null
        this.temp.endDate = null
      }else{
        this.temp.startDate = this.valueDate[0]
        this.temp.endDate = this.valueDate[1]
      }
    }


  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .el-form-item::after, .el-form-item::before{
    content: '';
  }
</style>
