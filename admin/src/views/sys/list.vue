<template>
  <div class="app-container">
    <div class="filter-container">
      <!--新增按钮-->
      <el-button type="primary" @click="handleCreate" class="addBtn">新增</el-button>

      <el-input :placeholder="'输入管理员名称'" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
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
      <el-button v-waves class="filter-item" type="primary"  @click="handleFilter">查询</el-button>

    </div>
    <el-table
      :data="list"
      :key="tableKey"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column :label="'ID'" prop="userId" align="center" width="100"></el-table-column>
      <el-table-column :label="'登录账号'" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'真实姓名'" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'手机号码'" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'角色'" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'创建时间'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.addTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="'操作'" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
<!--
          <el-button round size="mini" @click="updateData(scope.row)">编辑</el-button>
-->
<!--
          <el-button round size="mini">设置权限</el-button>
-->
          <el-button round size="mini" v-permission="['admin']" @click="rePwd(scope.row)">重置密码</el-button>
          <el-button round size="mini" v-permission="['admin']" @click="remove(scope.row)">删除</el-button>
          <span  v-permission="['editor']">暂无权限</span>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="userList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'登录账号'" prop="nickName">
          <el-input v-model="temp.nickName" :placeholder="'不能少于6个字节'"/>
        </el-form-item>
        <el-form-item :label="'真实姓名'" prop="userName">
          <el-input v-model="temp.userName" :placeholder="'请输入真实姓名'"/>
        </el-form-item>
        <el-form-item :label="'手机号码'" prop="phone">
          <el-input v-model="temp.phone" :placeholder="'请输入手机号码'"/>
        </el-form-item>
      </el-form>
      <p v-if="dialogStatus == 'create'" style="text-align: center;color:darkred">管理员初始密码为：123456，请修改密码</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import permission from '@/directive/permission/index.js'
  import { userList, userAdd, userDel, repwd } from '@/api/sys'
  import { validateIsPhoneNo } from '@/utils/validate'
  import waves from '@/directive/waves' // Waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves, permission },
    data() {
      const isPhoneNo= (rule, value, callback) => {
        if (!validateIsPhoneNo(value)) {
          callback(new Error('手机号码格式错误'))
        } else {
          callback()
        }
      }
      const nickNameRex= (rule, value, callback) => {
        if (value.length < 6 ) {
          callback(new Error('账号名不能少于6位'))
        } else {
          callback()
        }
      }
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        teptName:'',
        listQuery: {
          pageNo: 1,
          pageSize: 20
        },
        temp: {
          nickName: '',
          userName:'',
          phone: '',
          roleId:'2',
          deptId:'1'
        },
        dialogFormVisible:false,
        downloadLoading: false,
        valueDate:'',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        dialogStatus:'',
        textMap: {
          update: '编辑管理员',
          create: '新建管理员'
        },
        rules: {
          nickName: [
            { required: true,min: 1, max: 20, trigger: 'blur',validator:nickNameRex }
          ],
          userName: [
            { required: true, trigger: 'change' }
          ],
          phone: [
            { required: true, trigger: 'blur',validator: isPhoneNo }
          ],
        },
      }
    },
    created() {
      this.userList();
    },
    methods: {
      userList() {
        this.listLoading = true
        userList(this.listQuery).then(response => {
          this.list = response.items
          this.total = response.total
          this.listLoading = false
        })
      },

      handleFilter() {
        this.listQuery.pageNo = 1
        this.userList()
      },
      resetTemp() {
        this.temp = {
          nickName: '',
          userName: '',
          phone: '',
          roleId:'2',
          deptId:'1'
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
            //console.log(data);
            userAdd(this.temp).then(() => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.userList();

            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
        }})
      },
      handleDelete(row) {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      remove(scope){
        const index = scope.$index
        const userIds = scope.userId
        this.$confirm('确定将该管理员删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          userDel({userIds}).then( () =>{
            this.list.splice(index,1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      rePwd(scope){
        const userId = scope.userId

        this.$confirm('确定重置该管理员密码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          repwd({userId}).then( () =>{
            this.$message({
              type: 'success',
              message: '重置成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      blur() {
        if(!this.valueDate){
          this.listQuery.beginTime = null
          this.listQuery.endTime = null
        }else{
          this.listQuery.beginTime = this.valueDate[0]
          this.listQuery.endTime = this.valueDate[1]
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .fixed-width .el-button--mini{
    width: auto;
  }
  .addBtn{
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
</style>
