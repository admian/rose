import request from '@/utils/request'

// 活动列表
export function reportList(query) {
  return request({
    url: '/report/getReportList',
    method: 'post',
    params: query
  })
}

// 设置作品状态
export function worksEnable(query) {
  return request({
    url: '/production/enable',
    method: 'get',
    params: query
  })
}

// 音乐达人列表
export function musicorlList(query) {
  return request({
    url: '/musictalent/getList',
    method: 'post',
    params: query
  })
}

// 设置申请状态
export function musicorEnable(query) {
  return request({
    url: '/musictalent/setStatus',
    method: 'get',
    params: query
  })
}

