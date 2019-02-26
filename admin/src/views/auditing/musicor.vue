<template>
  <div class="app-container">
    <el-button type="text">批量通过</el-button>
    <el-button type="text">批量驳回</el-button>
    <el-table
      :data="list"
      :key="tableKey"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <!--<el-table-column :label="''" width="50px" align="center">
       <template slot-scope="scope">
         <input type="checkbox" name="check">
       </template>
     </el-table-column>-->
      <el-table-column
        type="selection"
        width="55"/>
      <el-table-column :label="'用户ID'" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'用户名称'" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'申请艺人名称'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.talentName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'微信号'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.wxCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'真实姓名'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'身份证号'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.idCard }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'身份证图片'" width="200px" align="center">
        <template slot-scope="scope">
          <img :src="'https://file.niyouxi77.com/'+scope.row.idCardUrl" class="headPic" @click="showCard(scope.row)">
        </template>
      </el-table-column>
      <el-table-column :label="'作品'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.musicUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'作品名称'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.musicName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'申请时间'" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fcd | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'状态'" width="100px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status==0">待审核</span>
          <span v-else-if="scope.row.status==1">已通过</span>
          <span v-else="scope.row.status==2">已驳回</span>
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" @click="passReject(scope,1)">通过</el-button>
          <el-button size="mini" @click="passReject(scope,2)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="showPicDia"
      title="身份证图片"
    >
     <img :src="idCardUrl" class="bigCard">
    </el-dialog>
  </div>
</template>

<script>
import { musicorlList, musicorEnable } from '@/api/auditing'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import MdInput from '../../components/MDinput/index' // Secondary package based on el-pagination
export default {
  name: 'ComplexTable',
  components: { MdInput, Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      idCardUrl:null,
      setStatus:'待审核',
      total: 0,
      listLoading: true,
      listQuery: {
        pageNo: 1,
        pageSize: 20
      },
      showPicDia: false,
      videoUrl: null,
      downloadLoading: false,
      valueDate: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      musicorlList(this.listQuery).then(response => {
        this.list = response.items;
        this.total = response.total;
        this.listLoading = false;
      })
    },
    handleFilter() {
      this.listQuery.pageNo = 1;
      this.getList()
    },
    showCard(scope){
      console.log(scope);
      this.showPicDia = true;
      this.idCardUrl = 'https://file.niyouxi77.com/'+scope.idCardUrl;
      console.log(scope.idCardUrl);
    },
    passReject(scope,status) {
      console.log(scope,status);
      const id = scope.row.id
      const index = scope.$index
      console.log('index==='+index)
      this.$confirm('确定是否更改状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        musicorEnable({ id, status }).then(() => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          scope.row.status = status
          console.log(scope);
          this.list[index].status = status
          this.list[index].btn =disabled
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消!'
        })
      })
    },

  }
}

</script>

<style scoped>
.bigCard{
  width: 100%;
  height: 100%;
}
</style>
