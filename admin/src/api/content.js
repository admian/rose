import request from '@/utils/request'

// 标签列表
export function contentTagList(query) {
  return request({
    url: '/labels/getList',
    method: 'post',
    params: query
  })
}

// 标签新增
export function contentTagAdd(query) {
  return request({
    url: '/labels/add',
    method: 'post',
    params: query
  })
}

// 标签新增
export function contentTagChange(query) {
  return request({
    url: '/labels/modify',
    method: 'post',
    params: query
  })
}

// 标签所有类型
export function labelsType(query) {
  return request({
    url: '/labels/getLabelsType',
    method: 'get',
    params: query
  })
}

// 广告 列表
export function bannerList(query) {
  return request({
    url: '/banner/getList',
    method: 'post',
    params: query
  })
}

// 修改广告
export function bannerChange(query) {
  return request({
    url: '/banner/modify',
    method: 'post',
    params: query
  })
}

// 新增广告
export function bannerAdd(query) {
  return request({
    url: '/banner/add',
    method: 'post',
    params: query
  })
}

// 删除广告
export function bannerDel(query) {
  return request({
    url: '/banner/delete',
    method: 'get',
    params: query
  })
}




