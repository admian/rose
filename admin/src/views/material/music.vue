<template>
  <div class="app-container">
    <audio :src="audio_src" id="player" controls style="display: none"></audio>
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">新增音乐
      </el-button>
    </div>
    <div class="filter-container">
      <el-input :placeholder="'音乐名称'" v-model="listQuery.musicName" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.musicType" placeholder="请选择">
        <el-option
          v-for="item,index in typeLists"
          :key="index"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
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
      <el-table-column :label="'音乐素材ID'" prop="id" align="fodderName" width="120"></el-table-column>
      <el-table-column :label="'音乐名称'" width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.musicName}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'音乐封面'" width="120px" align="center">
        <template slot-scope="scope">
          <img :src="'https://file.niyouxi77.com/'+scope.row.musicCover" class="headPic">
        </template>
      </el-table-column>

      <el-table-column :label="'原唱'" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.walkers }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'音乐类型'" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ showMusicType(scope.row.musicType) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'音乐时长'" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ formatMusicTime(scope.row.musicTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'音乐标签'" align="center">
        <template slot-scope="scope">
          <el-tag :type="''" v-for="item,index in scope.row.musicLabelsList" :key="index">{{item.labelsName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="'权重'" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orders }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'发布时间'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lcd | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'状态'" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.enable == 1 ? '显示':'不显示'}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="140" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button round size="mini" @click="changeInfo(scope.row)">编辑</el-button>
          <el-button round size="mini" @click="changeState(scope)">{{ scope.row.enable == 1 ? '下架':'开启'}}</el-button>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>
    <el-dialog :title="dialogStatus === 'create' ? '新增音乐' : '编辑音乐'" :visible.sync="dialogFormVisible" @close="closeDia">
      <div class="allFrom clearfix">
        <div class="fl">
          <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px"
                   style="width: 400px; margin-left:50px;">
            <el-form-item :label="'音乐'" prop="musicUrl">
              <el-upload
                class="upload-demo"
                action="https://file.niyouxi77.com/files/upload"
                :data="data"
                :file-list="musicSrc"
                :before-upload="preview"
                :on-success="upSuccessMusicUrl"
              >
                <el-button size="small" type="primary" @click="fileIndex='dreamDetail' ">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="'音乐封面'" prop="musicCover">
              <el-upload
                class="upload-demo"
                action="https://file.niyouxi77.com/files/upload"
                :data="data"
                :file-list="musicCover"
                :on-success="upSuccessMusicCover"
                list-type="picture">
                <el-button size="small" type="primary" @click="fileIndex='dreamDetail' ">点击上传</el-button>
              </el-upload>
            </el-form-item>

            <el-form-item :label="'音乐名称'">
              <el-input v-model="temp.musicName" placeholder="Please input"/>
            </el-form-item>
            <el-form-item :label="'原唱'">
              <el-input v-model="temp.walkers" placeholder="Please input"/>
            </el-form-item>
            <el-form-item :label="'音乐类型'">
              <el-select v-model="temp.musicType" placeholder="请选择">
                <el-option
                  v-for="item,index in typeLists"
                  v-if="index != 0"
                  :key="index"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="'音乐标签'">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <div style="margin: 15px 0;"></div>
              <el-checkbox-group v-model="musicLabelsList" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="item,index in tagLists" :label="item.id" :key="index">{{item.labelsName}}</el-checkbox>
              </el-checkbox-group>
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
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确定</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  import { musicList, musicTypeList, musicModify, musicAdd } from '@/api/music'
  import { contentTagList } from '@/api/content'
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
        proTotal: 0,
        listLoading: true,
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          musicName: null,
          musicType: null
        },
        listTypeQuery: {
          pageNo: 1,
          pageSize: 20
        },
        tagQuery: {
          pageNo: 1,
          pageSize: 20,
          labelsTypeId:7
        },
        dialogFormVisible: false,
        dialogStatus: null,
        valueDate: '',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        tempSelectType: null,
        tempSelectLable: null,
        loading: false,
        data: { key: 'abc' },
        musicSrc: [],
        musicCover: [],
        typeLists: [],
        tagLists: [],
        fileIndex: null,
        musicLabelsList:[],
        temp: {
          musicId: null,
          musicName: null,
          musicType: null,
          description: null,
          musicFree: null,
          musicCover: null,
          musicTime: null,
          walkers: null,
          levelId: null,
          musicUrl: null,
          orders: 0,
          enable: 1,
          musicLabelsList:[],
          musicLabelsIds:[]
        },
        checkAll: false,
        isIndeterminate: true,
        audio_src:null
      }
    },
    created() {
      this.getList()
      musicTypeList(this.listTypeQuery).then(res => {
        this.typeLists = res.items
        this.typeLists.unshift({ id: '', name: '全部' })
      })
      contentTagList(this.tagQuery).then(res => {
        this.tagLists = res.items
      })
    },
    methods: {
      preview(file){
        const _this = this
        let reader = new FileReader()
        reader.readAsDataURL(file);
        reader.onload = function(){
          _this.audio_src = this.result
        }
        let du = document.getElementById('player')
        du.oncanplaythrough = function(){
          _this.temp.musicTime = du.duration
        }


      },
      handleCheckAllChange(val) {
        let tagLists = [];
        this.tagLists.map(function(i) {
          tagLists.push(i.id);
        })
        this.musicLabelsList = val ? tagLists : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.tagLists.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.tagLists.length;
      },

      getList() {
        this.listLoading = true
        musicList(this.listQuery).then(response => {
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
        this.musicLabelsList = []
        this.temp = {
          musicId: null,
          musicName: null,
          musicType: null,
          description: null,
          musicFree: null,
          musicCover: null,
          musicTime: null,
          walkers: null,
          levelId: null,
          musicUrl: null,
          orders: 0,
          enable: 1,
          musicLabelsList:[],
          musicLabelsIds:null
        }
      },
      handleCreate() {
        this.resetTemp()
        this.valueDate = ''
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
          musicModify({ musicId, enable }).then(() => {
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
      changeInfo(row) {
        let labelsList = [];
        this.temp = Object.assign({}, row) // copy obj
        this.temp.musicLabelsList.map(function(i) {
          labelsList.push(i.labelsId);
        })
        this.musicLabelsList = labelsList;
        this.temp.musicId = this.temp.id;
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.musicCover = [{name:'封面图',url:'https://file.niyouxi77.com/'+row.musicCover,path:row.musicCover}];
        this.musicSrc = [{name:'音乐路径',url:'https://file.niyouxi77.com/'+row.musicUrl,path:row.musicUrl}];

        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      upSuccessMusicUrl(res, file, fileList){
        this.temp.musicUrl = res.path
      },
      upSuccessMusicCover(res, file, fileList){
        this.temp.musicCover = res.path
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let that = this
            this.musicLabelsList.map(function(i) {
              let obj = {
                "id": i,
              }
              that.temp.musicLabelsList.push(obj)
            })
            musicAdd(this.temp).then(res => {
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
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let that = this
            that.temp.musicLabelsList = []
            this.musicLabelsList.map(function(i) {
              let obj = {
                "id": i,
              }
              that.temp.musicLabelsList.push(obj)
            })
/*            this.temp.musicCover = this.musicCover[0].path
            this.temp.musicUrl = this.musicUrl[0].path*/
            let _this = this
            musicModify(this.temp).then(() => {
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

      closeDia() {
        this.musicLabelsList = []
        this.musicSrc = []
        this.musicCover = []
        this.checkAll = false
        this.isIndeterminate = true
      },
      showMusicType(type) {
        let txt = ''
        this.typeLists.map(function(i) {
          if (i.id == type) {
            txt = i.name
          }
        })
        return txt
      },
      formatMusicTime(time) {
        let m = 0, s = 0
        m = parseInt(time / 60)
        s = time % 60
        m = m <= 9 ? '0' + m : m
        s = s <= 9 ? '0' + s : s
        return m + ':' + s
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .fixed-width .el-button--mini {
    width: auto;
  }

  .video {
    position: relative;
    cursor: pointer;
    span {
      padding: 3px;
      position: absolute;
      top: 3px;
      left: 3px;
      background-color: #fff;
    }
    img {
      width: 100px;
      height: 100px;
    }
  }

  .diaVideo {
    display: block;
    width: 70%;
    margin: 0 auto;
  }

</style>
<style>
  .proDia .el-dialog {
    min-width: 70%;
  }

  .el-tag {
    margin: 5px;
  }
</style>
