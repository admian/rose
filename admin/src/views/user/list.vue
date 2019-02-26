<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="'用户ID/昵称'" v-model="listQuery.key" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        class="date-picker"
        v-model="valueDate"
        value-format="yyyy-MM-dd hh:mm:ss"
        type="daterange"
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
      <el-table-column :label="'用户ID'" prop="id" align="center" width="80"></el-table-column>
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
      <el-table-column :label="'性别'" width="60px">
        <template slot-scope="scope">
          <span>{{scope.row.sex ? scope.row.sex == 0 ? '男' : '女' : '----' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'生日'" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.birthday | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'手机号'" width="130px">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'QQ'" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.qq ? '已绑定' : '未绑定' }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'微信'" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.weChatNo ? '已绑定' : '未绑定' }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column :label="'微博'" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.microblog ? '已绑定' : '未绑定' }}</span>
        </template>
      </el-table-column>-->
      <el-table-column :label="'注册时间'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.registerDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button round size="mini" @click="handle(scope.row.id,'art')">细胞</el-button>
          <el-button round size="mini" @click="handle(scope.row.id,'labels')">标签</el-button>
          <el-button round size="mini" @click="handle(scope.row.id,'production')">作品</el-button>
          <el-button round size="mini" @click="handle(scope.row.id,'honor')">荣誉</el-button>
          <el-button round size="mini" @click="changeRec(scope)">{{scope.row.isRec == 1 ? '取消推荐' : '推荐'}}</el-button>
          <el-button round size="mini" @click="handle(scope.row.id,'toBlack',scope.$index)">拉黑
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <el-dialog v-loading="loading" title="艺术细胞" :visible.sync="popup_art" center>
      <ul class="popup_list" v-if="popup_art_list.length">
        <li v-for="item,index in popup_art_list" :key="index">{{item.artTypeName}}：<span>{{item.context}}</span></li>
      </ul>
      <p v-if="!popup_art_list.length" style="text-align: center">暂无信息</p>

    </el-dialog>

    <el-dialog v-loading="loading" title="标签" :visible.sync="popup_labels" center>
      <el-tag v-if="popup_labels_list.length" :type="tagList[Math.floor(Math.random()*tagList.length)]" v-for="item,index in popup_labels_list" :key="index">{{item}}</el-tag>
      <p v-if="!popup_labels_list.length" style="text-align: center">暂无信息</p>
    </el-dialog>

    <el-dialog v-loading="loading" :title="popup_production_title+'的作品'" :visible.sync="popup_production" center>
      <el-table
        :data="popup_production_list"
        :key="tableKey"
        border
        fit
        :show-header="false"
        highlight-current-row
        style="width: 100%;"
        class="userPro"
      >
        <el-table-column width="150px" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.productionCover" class="headPic" @click="showVideo(scope.row)">
            <p>发布：{{scope.row.startDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <p>{{scope.row.productionName}}</p>
            <p>{{scope.row.dreamName == null ? '参与《'+ scope.row.dreamName+'》活动' : '无参加活动'}}</p>
          </template>
        </el-table-column>

      </el-table>

      <pagination v-show="userTotal>0" :total="userTotal" :page.sync="userQuery.pageNo" :limit.sync="userQuery.pageSize" @pagination="getUserPro" />

    </el-dialog>

    <el-dialog v-loading="loading" :title="honerTitle + '的荣誉'" :visible.sync="popup_honor" center>
      <el-table
        :data="popup_honor_list"
        stripe
        style="width: 100%"
        height="490"
        fit
        highlight-current-row
        :show-header="false"
      >
        <el-table-column width="100">
          <template slot-scope="scope">
            <p>{{scope.$index + 1}}</p>
            <p>{{scope.row.startDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="productionName"></el-table-column>

        <el-table-column>
          <template slot-scope="scope">
            <el-button round size="mini" @click="changeHonor(scope)">{{scope.row.isHonor == 1 ? '移除荣誉' : '开启荣誉'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="honerTotal>0" :total="honerTotal" :page.sync="honorQuery.pageNo" :limit.sync="honorQuery.pageSize" @pagination="getUserHonor" />

    </el-dialog>

    <el-dialog title="拉黑" :visible.sync="popup_toBlack" center class="popup">
      <el-input
        class="input_item"
        disabled
        :value="'用户ID：'+ blackUserId"
        clearable>
      </el-input>
      <el-input
        class="input_item"
        placeholder="请输入拉黑原因"
        v-model="blackTxt"
        clearable>
      </el-input>
      <div class="btn_wrap">
        <el-button size="small" type="danger" @click="cancel">取消</el-button>
        <el-button size="small"  type="primary" @click="handleConfirm(blackUserId,blackTxt)">确定</el-button>
      </div>
    </el-dialog>

    <!--视频弹窗-->
    <el-dialog title="视频" :visible.sync="popup_video" center class="popup">
      <video :src="video_src" controls style="width: 100%"></video>
    </el-dialog>

  </div>
</template>

<script>
import { userList, art, labels, production, honor, toBlack, removeHonor,changeRec } from '@/api/userInfo'
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
      list: [],
      total: 0,
      userTotal: 0,
      honerTotal: 0,
      honerTitle: null,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        beginTime: undefined,
        endTime: undefined,
        key: ''
      },
      userQuery: {
        pageNo: 1,
        pageSize: 10,
        userId:null
      },
      valueDate:'',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      tagList:[
        '',
        'success',
        'info',
        'warning',
        'danger'
      ],
      honorQuery:{
        pageNo: 1,
        pageSize: 10,
        userId:null
      },
      index:'',
      downloadLoading:false,
      loading:false,
      blackTxt:'',
      blackUserId:'',
      popup_art:false,
      popup_labels:false,
      popup_production:false,
      popup_honor:false,
      popup_toBlack:false,
      popup_art_list:[],
      popup_labels_list:[],
      popup_production_list:[],
      popup_production_title:null,
      popup_honor_list:[],
      popup_video:false,
      video_src:null

    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      userList(this.listQuery).then(res => {
        this.list=res.items
        this.total = res.total
        this.listLoading = false
      })
    },
    getUserPro() {
      this.loading = true
      production(this.userQuery).then( res =>{
        this.loading = false;
        this.popup_production_list = res.userProPage.items
        this.popup_production_title = res.userName
        this.userTotal = res.userProPage.total
      })
    },
    getUserHonor() {
      this.loading = true
      honor(this.honorQuery).then( res =>{
        this.loading = false;
        this.popup_honor_list = res.proHonorlist.items
        this.honerTitle = res.nickName
        this.honerTotal = res.proHonorlist.total
      })
    },
    handle(userId,type,index){
      this['popup_'+type] = true;
      this.loading = true;
      switch (type) {
        case 'art':
          art({userId}).then( res =>{
            this.loading = false;
            this.popup_art_list = res
          })
          break;
        case 'labels':
          labels({userId}).then( res =>{
            this.loading = false;
            this.popup_labels_list = res
          })
          break;
        case 'production':
          this.resetUserQuery()
          this.userQuery.userId = userId
          this.getUserPro();
          break;
        case 'honor':
          this.resetHoner();
          this.honorQuery.userId = userId
          this.getUserHonor()
          break;
        case 'toBlack':
          this.loading = true;
          this.index = index;
          this.blackUserId = userId;
          break;

      }
    },
    changeRec(scope){
      let userId = scope.row.id;
      let isRec = scope.row.isRec == 1 ? 0 : 1
      changeRec({userId,isRec}).then( res => {
        this.$message({
          showClose: true,
          message: '操作成功！！',
          type: 'success'
        });
        this.getList()
      })
    },
    cancel(){
      this.blackTxt = '';
      this.popup_toBlack = false;
    },
    resetHoner(){
      this.honorQuery = {
        pageNo: 1,
        pageSize: 20,
        userId:null
      }
    },
    resetUserQuery(){
      this.userQuery = {
        pageNo: 1,
          pageSize: 10,
          userId:null
      }
    },
    handleConfirm(userId,description){
      if(!description){
        this.$message({
          showClose: true,
          message: '拉黑原因不能为空！！',
          type: 'warning'
        });
        return
      }
      toBlack({userId,description}).then( () =>{
        this.$message({
          showClose: true,
          message: '已成功拉黑！！',
          type: 'success'
        });
        this.list.splice(this.index,1)
        this.blackTxt = '';
        this.popup_toBlack = false;
        this.total --;
      })
    },

    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户ID','用户头像', '用户昵称', '性别', '生日', 'QQ','微信','注册时间']
        const filterVal = ['id', 'headUrl', 'nickName', 'sex', 'birthday', 'qq', 'weChatNo', 'registerDate']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '用户列表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'birthday' || j == 'registerDate') {
          return parseTime(v[j])
        }else if(j == 'sex'){
          return v[j] == 1 ? '男' : v[j] == 2 ?  '女' : '--'
        } else {
          return v[j]
        }
      }))
    },
    blur() {
      if(!this.valueDate){
        this.listQuery.beginTime = null
        this.listQuery.endTime = null
      }else{
        this.listQuery.beginTime = this.valueDate[0]
        this.listQuery.endTime = this.valueDate[1]
      }
    },
    showVideo(scope){
      this.popup_video = true;
      this.video_src = scope.videoUrl;
    },
    changeHonor(scope){
      const productionId = scope.row.id;
      const index = scope.$index;
      this.$confirm('此操作将移除此荣誉, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeHonor({productionId}).then( ()=> {
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.popup_honor_list.splice(index,1)
          this.honerTotal --;
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        });
      });
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .fixed-width .el-button--mini{
    width: auto;
  }
  .popup{
    .input_item{
      margin-bottom: 10px;
    }
    .btn_wrap{
      width: max-content;
      margin:0 auto;
    }
  }
  .popup_list{
    list-style-type:none;
    font-size: 14px;
    li{
      padding:10px 0;
      span{
        color:#333;
      }
    }
  }

  .headPic{
    display: block;
    margin: 0 auto;
    cursor: pointer;
  }
  .userPro .has-gutter{
    display: none;
  }
</style>

