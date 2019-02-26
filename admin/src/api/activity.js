import request from '@/utils/request'

// 活动列表
export function activityList(query) {
  return request({
    url: '/dream/getList',
    method: 'post',
    params: query
  })
}

// 活动状态更改
export function setEnable(query) {
  return request({
    url: '/dream/enable',
    method: 'get',
    params: query
  })
}

// 查看活动作品
export function getDreamList(query) {
  return request({
    url: '/dream/getDream',
    method: 'get',
    params: query
  })
}

// 新增活动
export function dreamAdd(query) {
  return request({
    url: '/dream/add',
    method: 'post',
    params: query
  })
}

// 新增活动
export function dreamChange(query) {
  return request({
    url: '/dream/modify',
    method: 'post',
    params: query
  })
}

// 作品置顶
export function dreamTop(query) {
  return request({
    url: '/dream/top',
    method: 'get',
    params: query
  })
}


