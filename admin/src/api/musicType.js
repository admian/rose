import request from '@/utils/request'

// 音乐类型列表
export function musicTypeList(query) {
  return request({
    url: '/musicType/typeList',
    method: 'post',
    params: query
  })
}

// 音乐类型 修改
export function changeType(query) {
  return request({
    url: '/musicType/modify',
    method: 'post',
    data: query,
    headers: {'Content-Type': 'application/json; charset=UTF-8'},
  })
}

// 音乐类型 新增
export function musicTypeAdd(query) {
  return request({
    url: '/musicType/add',
    method: 'post',
    data: query,
    headers: {'Content-Type': 'application/json; charset=UTF-8'},
  })
}

// 音乐类型 状态切换
export function musicTypeEnable(query) {
  return request({
    url: '/musicType/setEnable',
    method: 'get',
    params: query
  })
}
