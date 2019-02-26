<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">新增素材
      </el-button>
      <el-select v-model="listQuery.channelId" placeholder="请选择" @change="getList()">
        <el-option
          v-for="item in sortChanne"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <el-table
      :data="list"
      :key="tableKey"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="'素材ID'" prop="id" align="fodderName" width="80"></el-table-column>
      <el-table-column :label="'素材名称'" prop="fodderName" align="fodderName" width="160"></el-table-column>
      <el-table-column :label="'素材描述'" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'素材封面'" width="120px" align="center">
        <template slot-scope="scope">
          <img :src="'https://file.niyouxi77.com/'+scope.row.fodderCover" class="headPic">
        </template>
      </el-table-column>

      <el-table-column :label="'素材类型'" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fodderTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'所属类别'" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.productionTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'开放时间'" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'截止时间'" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'标签'" width="150px" align="center">
        <template slot-scope="scope">
          <el-button round size="mini" @click="showTag(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column :label="'使用次数'" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fileSize}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'展示权重'" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orders}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'状态'" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.enable == 1 ? '显示':'不显示'}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button round size="mini" @click="changeInfo(scope.row)">编辑</el-button>
          <el-button round size="mini" @click="changeState(scope)">{{ scope.row.enable == 1 ? '关闭':'开启'}}</el-button>
          <el-button round size="mini" @click="showPro(scope.row)">作品</el-button>
          <el-button round size="mini" @click="showVideo('https://file.niyouxi77.com/'+scope.row.egUrl)">示例</el-button>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>
    <el-dialog title="素材管理" :visible.sync="dialogFormVisible" @close="closeDia">
      <div class="allFrom clearfix">
        <div class="fl">
          <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px"
                   style="width: 400px; margin-left:50px;">
            <el-form-item :label="'素材封面'" prop="fodderCover">
              <el-upload
                class="upload-demo"
                action="https://file.niyouxi77.com/files/upload"
                :data="data"
                :on-success="upSuccessEg"
                :file-list="themeBgList"
                list-type="picture">
                <el-button size="small" type="primary" @click="fileIndex='dreamDetail' ">点击上传</el-button>
              </el-upload>
            </el-form-item>


            <el-form-item :label="'素材名字'">
              <el-input v-model="temp.fodderName" placeholder="Please input"/>
            </el-form-item>
            <el-form-item :label="'素材描述'">
              <el-input type="textarea" v-model="temp.description" placeholder="Please input"/>
            </el-form-item>
            <el-form-item :label="'频道'">
              <el-select v-model="tempSelectType" :disabled="channelDis"  placeholder="请选择" @change="changeLableType">
                <el-option
                  v-for="item in channelList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="'素材类型'">
              <el-select v-model="tempFodderType"  placeholder="请选择">
                <el-option
                  v-for="item in fodderList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="'作品类型'">
              <el-select v-model="productionType" placeholder="请选择">
                <el-option
                  v-for="item in typeLists"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="'素材标签'">
              <el-select v-model="tempSelectLable" placeholder="请选择" multiple>
                <el-option
                  v-for="item in labelsList"
                  :key="item.id"
                  :label="item.labelsName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="'活动时间'" prop="description">
              <el-date-picker
                class="date-picker"
                v-model="valueDate"
                type="daterange"
                time-arrow-control
                value-format="yyyy-MM-dd hh:mm:ss"
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
                clearable>
              </el-input>
            </el-form-item>
            <el-form-item :label="'示例'" prop="dreamShareCover">
              <el-upload
                class="upload-demo"
                action="https://file.niyouxi77.com/files/upload"
                :data="data"
                :limit="1"
                :on-success="upSuccessFodder"
                :file-list="egList"
                >
                <el-button size="small" type="primary" @click="fileIndex='dreamDetail' ">点击上传</el-button>
              </el-upload>
            </el-form-item>

          </el-form>

        </div>
        <!--配音-->
        <div class="fr" v-if="temp.channelId == 2">
          <el-form ref="audioForm" :model="temp" label-position="left" label-width="70px"
                   style="width: 400px; margin-left:50px;">
            <el-form-item :label="'字幕'" prop="fodderCover">
              <el-upload
                class="upload-demo"
                action="https://file.niyouxi77.com/files/upload"
                :data="data"
                :on-success="audioTxt"
                :file-list="audio.txt"
                :limit="1"

              >
                <el-button size="small" type="primary" @click="fileIndex='dreamDetail' ">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="'配音无声'" prop="fodderCover">
              <el-upload
                class="upload-demo"
                action="https://file.niyouxi77.com/files/upload"
                :data="data"
                :on-success="audioDub"
                :file-list="audio.dub"
                :limit="1"

              >
                <el-button size="small" type="primary" @click="fileIndex='dreamDetail' ">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="'配音背景'" prop="fodderCover">
              <el-upload
                class="upload-demo"
                action="https://file.niyouxi77.com/files/upload"
                :data="data"
                :on-success="audioBgm"
                :file-list="audio.bgm"
                :limit="1"

              >
                <el-button size="small" type="primary" @click="fileIndex='dreamDetail' ">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div class="fr" v-if="temp.channelId == 1">
          <el-form ref="audioForm" :model="temp" label-position="left" label-width="70px"
                   style="width: 400px; margin-left:50px;">
            <el-form-item :label="'演艺原生'" prop="fodderCover">
              <el-upload
                class="upload-demo"
                action="https://file.niyouxi77.com/files/upload"
                :data="data"
                :on-success="upActNewBgm"
                :file-list="act.newBgm"
                :limit="1"

              >
                <el-button size="small" type="primary" @click="fileIndex='dreamDetail' ">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="'演艺BGM'" prop="fodderCover">
              <el-upload
                class="upload-demo"
                action="https://file.niyouxi77.com/files/upload"
                :data="data"
                :on-success="upActBgm"
                :file-list="act.bgm"
                :limit="1"

              >
                <el-button size="small" type="primary" @click="fileIndex='dreamDetail' ">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="'演艺台词文件'" prop="fodderCover">
              <el-upload
                class="upload-demo"
                action="https://file.niyouxi77.com/files/upload"
                :data="data"
                :on-success="upActDialogue"
                :file-list="act.dialogue"
                :limit="1"

              >
                <el-button size="small" type="primary" @click="fileIndex='dreamDetail' ">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item :label="'分镜'+item[0].fodderGroup" prop="fodderCover" v-for="item,index in groupList" :key="index">
              <el-card class="box-card" :body-style="{padding: '10px'}">
              <el-upload
                ref="groupFile"
                class="upload-demo"
                action="https://file.niyouxi77.com/files/upload"
                :data="data"
                :on-success="addGroupFile"
                :file-list="item"
                :limit="1"
                >
                <el-button size="small" type="primary" @click="groupIndex = index ">点击上传</el-button>
              </el-upload>
              <el-radio-group v-model="item[0].fodderSourceType">
                <el-radio :label="4">观看</el-radio>
                <el-radio :label="5">演艺</el-radio>
              </el-radio-group>
              </el-card>

            </el-form-item>
          </el-form>
          <el-button size="small" type="primary" @click="addGroup">增加分镜</el-button>
        </div>
        <!--演艺-->


      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="标签" :visible.sync="popup_tag" center>
      <el-tag :type="tagType[Math.floor(Math.random()*tagList.length)]" v-for="item,index in tagList" :key="index">
        {{item.labelsName}}
      </el-tag>
      <p v-if="!tagList || !tagList.length" style="text-align: center">暂无数据</p>
    </el-dialog>

    <!--作品-->
    <el-dialog :title="proTitle" :visible.sync="loading" class="proDia">
      <el-table :data="proList">
        <el-table-column label="" width="150">
          <template slot-scope="scope">
            <div class="video" @click="showVideo(scope.row.videoUrl)">
              <img :src="scope.row.productionCover">
              <span>No.{{scope.$index+1 + (fodderProQuery.pageNo-1) * fodderProQuery.pageSize}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="name" label="" width="200">
          <template slot-scope="scope">
            <p>作者：{{scope.row.nickName}}</p>
            <p>{{scope.row.endDate | parseTime('{y}-{m}-{d} {h}:{i}')}}</p>
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
      </el-table>
      <pagination class="test" v-show="proTotal>0" :total="proTotal" :page.sync="fodderProQuery.pageNo"
                  :limit.sync="fodderProQuery.pageSize" @pagination="showPro()"/>


    </el-dialog>
    <el-dialog
      title="示例视频"
      :visible.sync="showVideoDia"
      append-to-body
    >
      <video class="diaVideo" controls :src="videoUrl"></video>
    </el-dialog>

  </div>
</template>

<script>
  import {
    materialList,
    materialChangeState,
    materialChangeinfo,
    materialAdd,
    materialType,
    checkTagOne,
    fodderPro,
    materialLabels,
    materialAddSource,
    fodderGetOne,
    fodderLabels
  } from '@/api/material'
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
        tempSelectType: null,
        tempSelectLable: [],
        total: 0,
        proTotal: 0,
        listLoading: true,
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          channelId:''
        },
        sortChanne:[
          {id:'',name:'全部'},
          {id:2,name:'配音'},
          {id:1,name:'演绎'}
        ],
        dialogFormVisible: false,
        showVideoDia: false,
        videoUrl: null,
        downloadLoading: false,
        dialogStatus: null,
        valueDate: '',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        popup_tag: false,
        loading: false,
        tagType: [
          '',
          'success',
          'info',
          'warning',
          'danger'
        ],
        data: { key: 'abc' },
        egList: [],
        channelList: [
          { id: 1, name: '演艺' },
          { id: 2, name: '配音' }
        ],
        typeLists: [],
        fodderList: [],
        themeBgList: [],
        tagList: [],
        proList: [],
        proTitle: null,
        temp: {
          channelId:null,
          addFodderSourceRequestList: [],
          attention: 'null',
          fodderType: null,
          description: null,
          egUrl: null,
          enable: 0,
          fodderCover: null,
          fodderFree: 0,
          fodderName: null,
          labelsList: [],
          levelId: 0,
          orders: 0,
          productionType: null,
          endDate: 'string',
          startDate: 'string'
        },
        productionType: null,
        tempFodderType: null,
        labelsList: [],
        source_state: false,
        fodderProQuery: {
          pageNo: 1,
          pageSize: 20,
          fodderId: null
        },
        audio: {
          txt: [],
          bgm: [],
          dub: []
        },
        act: {
          newBgm: [],
          bgm: [],
          dialogue: []
        },
        groupList:[],
        groupIndex:null,
        channelDis:false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        materialList(this.listQuery).then(response => {
          this.list = response.items
          this.total = response.total
          this.listLoading = false
        })
      },
      changeLableType(val) {
        let type = val == 1 ? 4 : val == 2 ? 5 : null
        materialType(val).then(res => {
          this.typeLists = res
        })
        this.temp.channelId = val
        fodderLabels(val).then( res => {
          this.fodderList = res
        })
        materialLabels(type).then(res => {
          this.labelsList = res
        })
      },
      handleFilter() {
        this.listQuery.pageNo = 1
        this.getList()
      },
      resetTemp() {
        this.tempSelectType = null
        this.tempFodderType = null
        this.temp = {
          channelId:null,
          fodderType: null,
          addFodderSourceRequestList: [],
          attention: 'null',
          description: null,
          egUrl: null,
          enable: 0,
          fodderCover: null,
          fodderFree: 0,
          fodderName: null,
          labelsList: [],
          levelId: 0,
          orders: 0,
          productionType: null,
          endDate: 'string',
          startDate: 'string'
        }
      },
      handleCreate() {
        /*        this.$message({
                  type: 'error',
                  message: '此功能暂不开放!'
                });
                return*/

        this.resetTemp()
        this.valueDate = ''
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      showTag(fodderId) {
        this.popup_tag = true
        checkTagOne({ fodderId }).then(res => {
          this.tagList = res
        })
      },
      changeState(scope) {
        const fodderId = scope.row.id
        const index = scope.$index
        let enable = scope.row.enable == 0 ? 1 : 0
        this.$confirm('确定更改作品状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          materialChangeState({ fodderId, enable }).then(() => {
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
      changeInfo(scope) {
        //fodderSourceType :
        // 1	配音无声
        // 2	配音背景音
        // 3	字幕文件
        const fodderId = scope.id
        fodderGetOne({ fodderId }).then(res => {
          this.channelDis = true
          this.temp = Object.assign({}, res)
          const _this = this
          this.tempSelectType = this.temp.channelId
          this.tempFodderType = this.temp.fodderType
          this.changeLableType(this.tempSelectType)
          this.productionType = res.productionType
          res.fodderSourceList.map(function(i) {
            i.url = 'https://file.niyouxi77.com/'+i.sourceUrl
            i.path = i.sourceUrl

            if(i.fodderSourceType == 1){
               _this.audio.dub.push(i)
            }else if(i.fodderSourceType == 2){
                _this.audio.bgm.push(i)
            }else if(i.fodderSourceType == 3){
               _this.audio.txt.push(i)
            }else if(i.fodderSourceType == 4 || i.fodderSourceType == 5){
              let arr = [i]
              _this.groupList.push(arr)
            }else if(i.fodderSourceType == 6){
              _this.act.newBgm.push(i)
            }else if(i.fodderSourceType == 7){
              _this.act.bgm.push(i)
            }else if(i.fodderSourceType == 8){
              _this.act.dialogue.push(i)
            }
          })
          _this.groupList.sort(function(a,b) {
            return a[0].fodderGroup - b[0].fodderGroup;
          })
          res.labelsList.map(function(i) {
            _this.tempSelectLable.push(i.id)

          })
          this.themeBgList = [{
            name: '素材',
            url: 'https://file.niyouxi77.com/' + scope.fodderCover,
            path: scope.fodderCover
          }]
          this.egList = [{ name: '示例', url: 'https://file.niyouxi77.com/' + scope.egUrl, path: scope.egUrl }]
          this.valueDate = [new Date(scope.startDate), new Date(scope.endDate)]
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.temp.typeList = this.tempSelect
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        })
      },
      showPro(scope) {
        if (scope) {
          this.fodderProQuery.fodderId = scope.id
        }
        this.loading = true
        fodderPro(this.fodderProQuery).then(res => {
          this.proTitle = res.fodderName
          this.proList = res.productionViewPage.items
          this.proTotal = res.productionViewPage.total
        })
      },
      showVideo(url) {
        this.videoUrl = url
        this.showVideoDia = true
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const _this = this
            /*  //本地调试数据
                        this.temp.egUrl = 'dasdsa'
                        this.temp.fodderCover = 'dasdsa'

                        this.audio.txt =  [{name:'字幕',url:'https://file.niyouxi77.com/',path:'asdasdsad',fodderSourceType:3,sourceUrl:'dsadasdsadas',fodderGroup:0}]
                        this.audio.bgm =  [{name:'背景',url:'https://file.niyouxi77.com/',path:'asdasdsad',fodderSourceType:2,sourceUrl:'dsadasdsadas',fodderGroup:0}]
                        this.audio.dub =  [{name:'配音',url:'https://file.niyouxi77.com/',path:'asdasdsad',fodderSourceType:1,sourceUrl:'dsadasdsadas',fodderGroup:0}]
            */
            this.temp.fodderSourceList = [];


            if(this.temp.channelId == 2){
              for (let k in this.audio) {
                _this.temp.fodderSourceList.push(_this.audio[k][0])
              }
            }else if(this.temp.channelId == 1){
              for (let k in this.act) {
                _this.temp.fodderSourceList.push(_this.act[k][0])
              }
            }
/*
            this.groupList.map(function(i) {
              _this.temp.fodderSourceList.push(i[0])
            })*/

            this.tempSelectLable.map(function(i) {
              let obj = {
                'description': null,
                'enable': 0,
                'fcd': null,
                'fcu': null,
                'id': i,
                'labelsName': null,
                'labelsType': 0,
                'lcd': null,
                'lcu': null,
                'orders': 0,
                'themePic': null
              }
              _this.temp.labelsList.push(obj)
            })

            this.temp.productionType = this.productionType
            this.temp.fodderType = this.tempFodderType
            this.temp.fodderCover = this.themeBgList[0].path
            this.temp.egUrl = this.egList[0].path
            this.temp.fodderSourceRequestList = this.temp.fodderSourceList
            materialAdd(this.temp).then(res => {
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
              this.dialogFormVisible = false
            })
          }
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const _this = this
            _this.temp.labelsList = []
            this.temp.startDate = parseTime(this.temp.startDate)
            this.temp.endDate = parseTime(this.temp.endDate)
            this.tempSelectLable.map(function(i) {
              let obj = {
                'description': null,
                'enable': 0,
                'fcd': null,
                'fcu': null,
                'id': i,
                'labelsName': null,
                'labelsType': 0,
                'lcd': null,
                'lcu': null,
                'orders': 0,
                'themePic': null
              }
              _this.temp.labelsList.push(obj)
            })
            this.temp.fodderId =  this.temp.id
            this.temp.fodderCover = this.themeBgList[0].path

            _this.temp.fodderSourceList = [];
            if(this.temp.channelId == 2){
              for (let k in this.audio) {
                _this.temp.fodderSourceList.push(_this.audio[k][0])
              }
            }else if(this.temp.channelId == 1){
              for (let k in this.act) {
                _this.temp.fodderSourceList.push(_this.act[k][0])
              }
            }
            this.groupList.map(function(i) {
              _this.temp.fodderSourceList.push(i[0])
            })

            this.temp.fodderSourceRequestList = this.temp.fodderSourceList

            materialChangeinfo(this.temp).then(() => {

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

      closeDia() {
        this.themeBgList = []
        this.tempSelectLable = []
        this.temp.productionType=null
        this.tempFodderType=null
        this.productionType=null
        this.egList = []
        this.groupList = []
        this.audio = {
          txt: [],
            bgm: [],
            dub: []
        }
        this.act = {
          newBgm: [],
            bgm: [],
            dialogue: []
        }
        this.tempSelect = null
        this.channelDis = false
      },
      audioTxt(res, file, fileList) {
        let id = null;
        this.temp.fodderSourceList.map(function(i) {
          if(i.fodderSourceType == 3){
            id = i.id;
          }
        })
        this.audio.txt = [{
          id,
          name: '字幕',
          url: res.url,
          path: res.path,
          fodderSourceType: 3,
          sourceUrl: res.path,
          fodderGroup: 0
        }]
      },
      audioDub(res, file, fileList) {
        let id = null;
        this.temp.fodderSourceList.map(function(i) {
          if(i.fodderSourceType == 1){
            id = i.id;
          }
        })
        this.audio.dub = [{
          name: '配音无声',
          id,
          url: res.url,
          path: res.path,
          fodderSourceType: 1,
          sourceUrl: res.path,
          fodderGroup: 0
        }]
      },
      audioBgm(res, file, fileList) {
        let id = null;
        this.temp.fodderSourceList.map(function(i) {
          if(i.fodderSourceType == 2){
            id = i.id;
          }
        })
        this.audio.bgm = [{
          name: '配音背景声',
          id,
          url: res.url,
          path: res.path,
          fodderSourceType: 2,
          sourceUrl: res.path,
          fodderGroup: 0
        }]
      },
      upSuccessEg(res, file, fileList) {
        this.themeBgList = [{ name: '封面', url: res.url, path: res.path }]
      },
      upSuccessFodder(res, file, fileList) {
        this.egList = [{ name: '示例', url: res.url, path: res.path }]
      },
      upActNewBgm(res, file, fileList) {
        let fodderId = null;
        fodderId = this.dialogStatus==='create' ? null : this.temp.id
        this.act.newBgm = [{ name: file.name, sourceUrl: res.path,url: res.url, path: res.path,fodderSourceType:6,fodderId }]
      },
      upActBgm(res, file, fileList) {
        let fodderId = null;
        fodderId = this.dialogStatus==='create' ? null : this.temp.id
        this.act.bgm = [{ name: file.name, sourceUrl: res.path,url: res.url, path: res.path,fodderSourceType:7,fodderId }]
      },
      upActDialogue(res, file, fileList) {
        let fodderId = null;
        fodderId = this.dialogStatus==='create' ? null : this.temp.id
        this.act.dialogue = [{ name: file.name, sourceUrl: res.path,url: res.url, path: res.path,fodderSourceType:8,fodderId }]
      },
      addGroupFile(res, file, fileList) {
        let obj = { name: file.name, url: res.url, path: res.path,sourceUrl: res.path}
        this.groupList[this.groupIndex][0] = Object.assign(this.groupList[this.groupIndex][0], obj)
      },
      addGroup(){
        let fodderGroup = this.groupList.length+1
        let obj = [{
          description: null,
          fodderGroup,
          fodderId: this.temp.id,
          fodderSourceType: 4,
          name: null,
          path: null,
          sourceUrl:null,
          id:null,
          url: null
        }]
        this.groupList.push(obj);

      },
      blur() {
        if (!this.valueDate) {
          this.temp.startDate = null
          this.temp.endDate = null
        } else {
          this.temp.startDate = this.valueDate[0]
          this.temp.endDate = this.valueDate[1]
        }
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
</style>
