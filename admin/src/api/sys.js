import request from '@/utils/request'
const Qs = require('qs')
// 管理员列表
export function userList(query) {
  return request({
    url: '/sysUser/getList',
    method: 'post',
    params: query
  })
}

// 增加管理员
export function userAdd(query) {
  return request({
    url: '/sysUser/add',
    method: 'post',
    data: query, // 传递数据为 request payload时  需要加以下请求头，参数从 params 改为 data
    headers: {'Content-Type': 'application/json; charset=UTF-8'},
  })
}

// 删除管理员
export function userDel(query) {
  return request({
    url: '/sysUser/delete',
    method: 'post',
    params: query,
  })
}

// 重置密码
export function repwd(query) {
  return request({
    url: '/sysUser/repwd',
    method: 'post',
    params: query,
  })
}

// 操作日志
export function logList(query) {
  return request({
    url: '/sysLog/getList',
    method: 'post',
    params: query,
  })
}



