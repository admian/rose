import request from '@/utils/request'

const Qs = require('qs')
export function loginByUsername(userName, password) {
  let data = {
    userName,
    password
  }

  data = Qs.stringify(data)
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/sys/logout',
    method: 'get'
  })
}

export function getUserInfo(roleId) {
  const data = {
    roleId
  }
  return request({
    url: '/role/getOne',
    method: 'get',
    params:data
  })
}

