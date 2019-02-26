import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { changePwd } from '@/api/sysUserInfo'
import { getToken, setToken, removeToken,getUserId, setUserId, removeUserId } from '@/utils/auth'

const user = {
  state: {
    user: '',
    userId:getUserId(),
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.userId = token
    },
    SET_USERID: (state, token) => {
      state.userId = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(res => {
          commit('SET_TOKEN', res.userId);
          let token = ''
          if(res.userId == 1){
            token = res.token || 'admin'
          }else{
            token = res.token || 'editor'
          }
          setToken(token)
          setUserId(res.userId)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 修改密码
    changeByPwd({ commit } , userPwd){
      return new Promise((resolve, reject) => {
        changePwd(userPwd.password, userPwd.passwordAg).then(data => {
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.userId).then(res => {
          let roles = [];
          if(state.userId == 1){
            roles = ['admin']
            state.token = 'admin'
            state.introduction = '超级管理员'
          }else{
            roles = ['editor']
            state.token = 'editor'
            state.introduction = '普通权限'
          }
          if (roles && roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          resolve({roleId:state.userId})
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_USERID', '')
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_USERID', '')
        removeToken()
        removeUserId()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(res => {
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve(res)
        })
      })
    }
  }
}

export default user
