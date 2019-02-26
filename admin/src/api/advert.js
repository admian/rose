import request from '@/utils/request'

// 广告列表
export function advertList(query) {
  return request({
    url: '/shareAdvert/getList',
    method: 'post',
    params: query
  })
}

//新增广告
export function advertAdd(query) {
  return request({
    url: '/shareAdvert/add',
    method: 'post',
    data: query,
    headers: {'Content-Type': 'application/json; charset=UTF-8'}
  })
}

//广告类型列表
export function advertTypeList(query) {
  return request({
    url: '/shareAdvert/getAdvertTypeList',
    method: 'post',
    params: query
  })
}

//广告位置列表
export function advertLocList(query) {
  return request({
    url: '/shareAdvert/getLocalList',
    method: 'post',
    params: query
  })
}

//广告位置列表
export function adverEnable(query) {
  return request({
    url: '/shareAdvert/enable',
    method: 'get',
    params: query
  })
}

//广告修改
export function adverModify(query) {
  return request({
    url: '/shareAdvert/modify',
    method: 'post',
    data: query,
    headers: {'Content-Type': 'application/json; charset=UTF-8'}
  })
}
