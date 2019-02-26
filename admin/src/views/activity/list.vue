<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新增活动</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      >
      <el-table-column :label="'活动ID'" prop="id" align="center" width="65">
      </el-table-column>
      <el-table-column :label="'活动名称'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dreamName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'活动描述'" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'封面'" width="110px" align="center">
        <template slot-scope="scope">
          <img class="headPic" :src="'https://file.niyouxi77.com/'+scope.row.dreamShareCover">
        </template>
      </el-table-column>
      <el-table-column :label="'主题背景'" width="110px" align="center">
        <template slot-scope="scope">
          <img class="headPic" :src="'https://file.niyouxi77.com/'+scope.row.dreamCover">
        </template>
      </el-table-column>
      <el-table-column :label="'活动详情'" width="110px" align="center">
        <template slot-scope="scope">
          <img class="headPic" :src="'https://file.niyouxi77.com/'+scope.row.dreamDetail">
        </template>
      </el-table-column>
<!--  功能暂未开放
      <el-table-column :label="'指定素材'" width="80px">
        <template slot-scope="scope">
        </template>
      </el-table-column>
-->
      <el-table-column :label="'开始时间'" align="center" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.startDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'结束时间'" class-name="status-col" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.endDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'排序权重'" class-name="status-col" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.orders }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'活动状态'" class-name="status-col" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.enable == 1 ? '进行中' : '已结束'}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'展示状态'" class-name="status-col" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.enable == 1 ? '开启' : '关闭'}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="380" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleModifyStatus(scope.row,'close')">{{scope.row.enable == 0 ? '开启' : '关闭'}}</el-button>
          <el-button size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" @click="handleModifyStatus(scope.row,'checkDream')">活动作品</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog :title="dialogStatus==='create' ? '新增活动' : '编辑活动'" :visible.sync="dialogFormVisible" @close="closeDia">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'封面'" prop="dreamShareCover">
          <el-upload
            class="upload-demo"
            action="https://file.niyouxi77.com/files/upload"
            :data="data"
            :limit="1"
            :file-list="shareCoverList"
            :on-success="upSuccessShareCover"
            list-type="picture">
            <el-button size="small" type="primary" @click="fileIndex='dreamShareCover'">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item :label="'背景图'" prop="dreamCover">
          <el-upload
            class="upload-demo"
            action="https://file.niyouxi77.com/files/upload"
            :on-success="upSuccessCover"
            :data="data"
            :limit="1"
            :file-list="dreamCoverList"
            list-type="picture">
            <el-button size="small" type="primary" @click="fileIndex='dreamCover' ">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item :label="'活动名称'" prop="dreamName">
          <el-input v-model="temp.dreamName"  placeholder="Please input"/>
        </el-form-item>
        <el-form-item :label="'活动描述'" prop="description">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.description" type="textarea" placeholder="Please input"/>
        </el-form-item>
        <el-form-item :label="'活动日期'">
          <el-date-picker
            class="date-picker"
            v-model="valueDate"
            value-format="yyyy-MM-dd hh:mm:ss"
            type="daterange"
            time-arrow-control
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="blur"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="'权重'">
          <el-input
            placeholder="请输入内容"
            type="number"
            v-model="temp.orders"
            maxlength="2"
            min="1"
            max="10"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item :label="'活动详情'">
          <el-upload
            class="upload-demo"
            action="https://file.niyouxi77.com/files/upload"
            :data="data"
            :limit="1"
            :on-success="upSuccessDreamDetai"
            :file-list="dreamDetailList"
            list-type="picture">
            <el-button size="small" type="primary" @click="fileIndex='dreamDetail' ">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dreamTitle" :visible.sync="dialogDream">
      <el-table :data="dreamList">
        <el-table-column  label="" width="150">
          <template slot-scope="scope">
            <div class="video" @click="showVideo(scope.row.videoUrl)">
              <img :src="scope.row.productionCover">
              <span>No.{{scope.$index+1 + (dreamQuery.pageNo-1) * dreamQuery.pageSize}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="name" label="" width="200">
          <template slot-scope="scope">
            <p>作者：{{scope.row.authName}}</p>
            <p>{{scope.row.startDate/1000 | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
            <span>评论数：{{scope.row.evaluateCount}}</span>
            <span>点赞数：{{scope.row.praiseCount}}</span>
          </template>

        </el-table-column>
        <el-table-column property="address" label="">
          <template slot-scope="scope">
            <p>{{scope.row.channelId == 3 ? '原创参加' : '素材参加'}}</p>
            <br/>
            <p>push：{{scope.row.pushCount}}</p>
          </template>
        </el-table-column>
        <el-table-column property="address" label="">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleTop(scope.row.id)">置顶</el-button>
<!--
            <el-button size="mini" @click="handleHoner(scope.row)">荣誉作品</el-button>
-->
          </template>
        </el-table-column>
      </el-table>
      <pagination class="test" v-show="dreamTotal>0" :total="dreamTotal" :page.sync="dreamQuery.pageNo" :limit.sync="dreamQuery.pageSize" @pagination="getDream()" />


      <el-dialog
        title="作品视频"
        :visible.sync="showVideoDia"
        append-to-body
      >
        <video class="diaVideo" controls :src="videoUrl"></video>
      </el-dialog>

    </el-dialog>



  </div>
</template>

<script>
import { activityList, setEnable, getDreamList, dreamAdd, dreamChange, dreamTop } from '@/api/activity'
import { worksSetHonor } from '@/api/works'
import { upLoad } from '@/api/upLoad'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      data:{key:'abc'},
      tableKey: 0,
      list: [],
      total: 0,
      dreamTotal: 0,
      listLoading: true,
      dialogFormVisible:false,
      dialogStatus:null,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
      },
      dreamQuery: {
        dreamId:null,
        pageNo: 1,
        pageSize: 10
      },
      rules:[],
      shareCoverList:[],
      dreamCoverList:[],
      dreamDetailList:[],
      temp: {
        dreamCover: null,
        dreamShareCover: null,
        dreamName: null,
        dreamDetail: null,
        dreamTitle: null,
        description: null,
        startDate: null,
        endDate: null,
        enable: 0,
        orders:0
      },
      dreamTitle:null,
      dialogDream:false,
      showVideoDia:false,
      dreamList:[],
      fileIndex:null,
      valueDate:null,
      videoUrl:null

    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      activityList(this.listQuery).then(res => {
        this.list = res.items
        this.total = res.total
        this.listLoading = false
      })
    },
    getDream() {
      getDreamList(this.dreamQuery).then( res =>{
        this.dreamTitle = res.dreamName;
        this.dialogDream = true;
        this.dreamList = res.dreamProEntityList.items
        this.dreamTotal = res.dreamProEntityList.total
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        dreamCover: null,
        dreamShareCover: null,
        dreamDetail: null,
        dreamName: null,
        dreamTitle: null,
        description: null,
        startDate: null,
        endDate: null,
        enable: 0,
        orders:0,
      }
    },
    resetDreamQuery() {
      this.temp = {
        dreamId:null,
        pageNo: 1,
        pageSize: 10
      }
    },
    handleModifyStatus(data,type){
      const dreamId = data.id;
      let enable = data.enable;
      enable = enable == 1 ? 0 : 1;
      switch (type) {
        case 'close':
          let txt = enable == 1 ?  '开启' : '关闭'
          this.$confirm('此操作将'+txt+'活动, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            setEnable({dreamId,enable}).then( ()=> {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              data.enable = enable
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消操作'
            });
          });
          break
        case 'checkDream':
          this.resetDreamQuery();
          this.dreamQuery.dreamId = dreamId
          this.getDream();
      }
    },
    handleTop(dreamId){
      dreamTop({dreamId}).then( () => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      })
    },
/*  暂时不开放，后台需调整
    handleHoner(scope){
      const productionId = scope.id
      const honor = scope.honor
      worksSetHonor({productionId,honor}).then( () => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      })
    },
*/
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
          this.temp.dreamCover = this.dreamCoverList[0].path
          this.temp.dreamShareCover = this.shareCoverList[0].path
          this.temp.dreamDetail = this.dreamDetailList[0].path
          dreamAdd(this.temp).then(() => {
            //this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            setTimeout(function() {
              location.reload()
            },1000)
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.shareCoverList = [{name:'封面图',url:'https://file.niyouxi77.com/'+row.dreamShareCover,path:row.dreamShareCover}];
      this.dreamCoverList = [{name:'背景图',url:'https://file.niyouxi77.com/'+row.dreamCover,path:row.dreamCover}];
      this.dreamDetailList = [{name:'活动详情',url:'https://file.niyouxi77.com/'+row.dreamDetail,path:row.dreamDetail}];
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.valueDate = [new Date(row.startDate), new Date(row.endDate)]

      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.startDate = parseTime(this.temp.startDate)
          this.temp.endDate = parseTime(this.temp.endDate)
          this.temp.dreamId = this.temp.id
          this.temp.dreamCover = this.dreamCoverList[0].path
          this.temp.dreamShareCover = this.shareCoverList[0].path
          this.temp.dreamDetail = this.dreamDetailList[0].path
          dreamChange(this.temp).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    showVideo(url){
      this.videoUrl = url;
      this.showVideoDia = true;
    },
    closeDia(){
      this.dreamCoverList = [];
      this.shareCoverList = [];
      this.dreamDetailList = [];
      this.valueDate = [];
    },
    upSuccessCover(res, file, fileList){
      this.dreamCoverList = [{name:file.name,url:'https://file.niyouxi77.com/'+res.path,path:res.path}];

    },
    upSuccessShareCover(res, file, fileList){
      this.shareCoverList = [{name:file.name,url:'https://file.niyouxi77.com/'+res.path,path:res.path}];
    },
    upSuccessDreamDetai(res, file, fileList){
      this.dreamDetailList = [{name:file.name,url:'https://file.niyouxi77.com/'+res.path,path:res.path}];

    },

    removeShareCover(file,fileList) {
      this.temp.dreamShareCover = null;
    },
    removeDreamCover(file,fileList) {
      this.temp.dreamCover = null;
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
<style rel="stylesheet/scss" lang="scss" scoped>
  .fixed-width .el-button--mini{
    width: auto;
  }

  .fixed-width .el-button--mini{
    width: auto;
  }
  .video{
    position: relative;
    cursor: pointer;
    span{
      position: absolute;
      top:3px;
      left: 3px;
      background-color: #fff;
    }
    img{
      width: 100px;
      height: 100px;
    }
  }
  .diaVideo{
    display: block;
    width: 70%;
    margin: 0 auto;
  }
</style>
