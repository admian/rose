import request from '@/utils/request'
const Qs = require('qs')
export function changePwd(oldPassword, newPassword) {
  let data = {
    oldPassword,
    newPassword
  }
  data = Qs.stringify(data)
  return request({
    url: '/sys/updatePass',
    method: 'post',
    data
  })
}
export function addUser(data) {

  data = Qs.stringify(data)
  return request({
    url: '/sysUser/add',
    method: 'post',
    data
  })
}
export function delUser(userIds) {
  userIds = Qs.stringify(userIds)
  return request({
    url: '/sysUser/delete',
    method: 'post',
    userIds
  })
}
export function userList(userIds) {
  userIds = Qs.stringify(userIds)
  return request({
    url: '/sysUser/getList',
    method: 'post',
    userIds
  })
}

export function repwd(userId) {
  userId = Qs.stringify(userId)
  return request({
    url: '/sysUser/repwd',
    method: 'post',
    userId
  })
}




