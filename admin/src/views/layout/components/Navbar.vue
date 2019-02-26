<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <error-log class="errLog-container right-menu-item"/>

        <el-tooltip :content="'全屏'" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>

        <el-tooltip :content="'布局大小'" effect="dark" placement="bottom">
          <size-select class="international right-menu-item"/>
        </el-tooltip>

        <el-tooltip :content="'换肤'" effect="dark" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"/>
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              <span style="display:block;" @click="dialogPvVisible = true">修改密码</span>
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :visible.sync="dialogPvVisible" title="修改密码">
      <div class="input-wrap">
        <el-input
          class=""
          :type="'password'"
          v-model="changePwd.password"
          placeholder="密码"
          auto-complete="on"
        >
          <template slot="append">请输入原密码</template>
        </el-input>
        <el-input
          :type="'password'"
          v-model="changePwd.passwordAg"
          placeholder="密码"
          auto-complete="on"
          @keyup.enter.native="handleLogin">
          <template slot="append">新密码不能低于六位</template>
        </el-input>
      </div>
      <div style="text-align: center">
        <el-button type="info" size="small " @click.native.prevent="cancel">取消</el-button>
        <el-button type="primary" size="small " @click.native.prevent="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import ThemePicker from '@/components/ThemePicker'

export default {
  data(){
    return{
      dialogPvVisible:false,
      changePwd:{
        password:'',
        passwordAg:'',
      }
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    cancel(){
      this.dialogPvVisible = false;
      this.changePwd.password = null;
      this.changePwd.passwordAg = null;
    },
    confirm(){
      if(this.changePwd.password.length <6 || this.changePwd.passwordAg.length <6){
        this.$message({
          message: '密码不合法',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }
      this.$store.dispatch('changeByPwd',this.changePwd).then( res=>{
        let type = 'error';
        let txt = res.msg;
        if(res){
          type = 'success'
          this.dialogPvVisible = false;
          txt = '密码修改成功!'
        }
        this.$message({
          message: txt,
          type,
          duration: 5 * 1000
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
  .el-dialog{
    .input-wrap{
      width: 60%;
    }
  }
</style>
