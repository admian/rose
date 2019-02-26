<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="'请输入关键词'" v-model="listQuery.key" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        class="date-picker"
        v-model="valueDate"
        type="daterange"
        value-format="yyyy-MM-dd hh:mm:ss"
        time-arrow-control
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
      <el-table-column :label="'用户ID'" prop="userId" align="center" width="70"></el-table-column>
      <el-table-column :label="'作品ID'" prop="id" align="center" width="70"></el-table-column>
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
      <el-table-column :label="'发布时间'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ !!scope.row.startDate ? getTime(scope.row.startDate,'{y}-{m}-{d} {h}:{i}') : '----' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'参与活动'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dreamName ? scope.row.dreamName : '不参加'}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'作品标题'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'素材名字'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fodderName ? scope.row.fodderName : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'类别'" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productionTypeName ? scope.row.productionTypeName : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'标签'" width="80px" align="center">
        <template slot-scope="scope">
          <el-button round size="mini" @click="showTag(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column :label="'作品属性'" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isHonor ? '荣誉作品' : '非荣誉作品'}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'作品封面'" width="80px" align="center">
        <template slot-scope="scope">
          <img class="headPic" :src="scope.row.productionCover" />
        </template>
      </el-table-column>
      <el-table-column :label="'状态'" width="80px" align="center" >
        <template slot-scope="scope">
          <span>{{ scope.row.enable? '显示' :'不显示'}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="360" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button round size="mini" @click="changeHoner(scope)">更改荣誉作品</el-button>
          <el-button round size="mini" @click="changeState(scope)">{{ scope.row.enable? '关闭作品' :'显示作品'}}</el-button>
          <el-button round size="mini" @click="showVideo(scope.row.videoUrl)">查看作品</el-button>
          <el-button round size="mini" @click="showComment(scope.row.id)">查看评价</el-button>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <!-- 标签 -->
    <el-dialog v-loading="loading" title="视频标签" :visible.sync="popup_tag" center>
      <el-tag :type="tagType[Math.floor(Math.random()*tagList.length)]" v-for="item,index in tagList" :key="index">{{item}}</el-tag>
      <p v-if="!tagList || !tagList.length" style="text-align: center">暂无数据</p>
    </el-dialog>

    <!-- 评论 -->
    <el-dialog v-loading="loading" :title="commentTitle" :visible.sync="popup_comment" center>
      <el-table
        :data="commentList"
        style="width: 100%"
        :row-class-name="tableRowClassName">
        <el-table-column
          width="180">
          <template slot-scope="scope">
            <p>{{ scope.row.userName}}</p>
            <p>{{ scope.row.evaluateDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
          </template>
        </el-table-column>
        <el-table-column
          width="320">
          <template slot-scope="scope">
            <span>{{ scope.row.evaluateBody }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="80">
          <template slot-scope="scope">
            <svg-icon icon-class="like-ico"></svg-icon>
            <span>{{ scope.row.evaluatePraiseCount }}</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button :loading="btnLoading && btnIndex" @click="changeCommentState(scope)">{{ scope.row.enable ? '屏蔽' : '显示' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="commentTotal>0" :total="commentTotal" :page.sync="commentQuery.pageNo" :limit.sync="commentQuery.pageSize" @pagination="getList" />
    </el-dialog>

    <!-- 视频 -->
    <el-dialog
      title="作品视频"
      :visible.sync="showVideoDia"
    >
      <video class="diaVideo" controls :src="videoUrl"></video>
    </el-dialog>
  </div>
</template>

<script>
  import { worksList, worksTag, worksEnable, worksComment, worksCommentEnable, worksSetHonor} from '@/api/works'
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
        commentTotal: 0,
        listLoading: true,
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          beginTime: undefined,
          endTime: undefined,
          key: ''
        },
        commentQuery: {
          pageNo: 1,
          pageSize: 20,
          productionId:null
        },
        downloadLoading: false,
        valueDate:'',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        tagList:[],
        tagType:[
          '',
          'success',
          'info',
          'warning',
          'danger'
        ],
        popup_tag:false,
        popup_comment:false,
        commentList:[],
        commentTitle:'',
        btnLoading:false,
        btnIndex:'',
        loading:false,
        videoUrl:null,
        showVideoDia:false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        worksList(this.listQuery).then(response => {
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
          const tHeader = ['用户ID','作品ID','用户头像', '用户昵称', '发布时间', '参与活动','作品标题','素材名字','类别','作品属性','状态']
          const filterVal = ['userId','id' ,'headUrl', 'nickName', 'startDate', 'dreamName','title','fodderName','productionTypeName','isHonor','enable']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '作品列表'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          }else if(j === 'isHonor'){
            v[j] ? '荣誉作品' : '非荣誉作品'
          }else if(j === 'enable'){
            v[j] ? '显示' : '不显示'
          } else {
            return v[j]
          }
        }))
      },

      // 查看评论
      showComment(productionId){
        this.loading = true;
        this.popup_comment = true;
        this.commentQuery.productionId = productionId
        worksComment(this.commentQuery).then( res =>{
          this.commentTitle = res.productTitle;
          this.loading = false
          if(!res.productionEvaluatePage){
            return
          }
          this.commentList = res.productionEvaluatePage.items;
          this.commentTotal = res.productionEvaluatePage.total;
        })
      },
      // 查看标签
      showTag(productionId){
        this.loading = true;
        this.popup_tag = true;
        worksTag({productionId}).then( res =>{
          this.tagList = res;
          this.loading = false;
        }).catch( err =>{
          this.loading = false;
        })
      },
      // 作品状态 设置
      changeState(scope){
        const productionId = scope.row.id;
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
      },

      // 作品状态 设置
      changeHoner(scope){
        const productionId = scope.row.id;
        const index = scope.$index;
        let honor = scope.row.isHonor == 0 ? 1 : 0;
        this.$confirm('确定更改作品状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          worksSetHonor({productionId,honor}).then( () =>{
            this.$message({
              type: 'success',
              message: '更改成功!'
            });
            scope.row.isHonor = honor
            this.list[index].isHonor = honor;
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消!'
          });
        });
      },

      // 评论状态  设置
      changeCommentState(scope){
        this.btnLoading = true;
        this.btnIndex = scope.row.$index;
        const evaluateId = scope.row.id;
        let enable = scope.row.enable;
        enable = enable == 0 ? 1 : 0;
        worksCommentEnable({evaluateId,enable}).then( ()=>{
          scope.row.enable = enable;
          this.btnLoading = false;
          this.btnIndex = '';
        })
      },
      // 时间选择
      blur() {
        if(!this.valueDate){
          this.listQuery.beginTime = null
          this.listQuery.endTime = null
        }else{
          this.listQuery.beginTime = this.valueDate[0]
          this.listQuery.endTime = this.valueDate[1]
        }
      },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex === 1) {
          return 'warning-row';
        } else if (rowIndex === 3) {
          return 'success-row';
        }
        return '';
      },

      //视频弹窗
      showVideo(url){
        this.videoUrl = url
        this.showVideoDia = true
      },
      getTime(time, cFormat){
        return parseTime(time, cFormat)
      }

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .fixed-width .el-button--mini{
    width: auto;
  }
  .diaVideo{
    display: block;
    width: 70%;
    margin: 0 auto;
  }
</style>
