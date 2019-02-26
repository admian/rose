import request from '@/utils/request'
const Qs = require('qs')

// 作品 列表
export function worksList(query) {
  return request({
    url: '/production/getList',
    method: 'post',
    params: query
  })
}

//作品 标签
export function worksTag(query) {
  return request({
    url: '/production/labels',
    method: 'get',
    params: query
  })
}

//作品 评论
export function worksComment(query) {
  return request({
    url: '/production/evaluate',
    method: 'get',
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

// 设置作品-评论状态
export function worksCommentEnable(query) {
  return request({
    url: '/production/setEnable',
    method: 'get',
    params: query
  })
}

// 设置作品-评论状态
export function worksSetHonor(query) {
  return request({
    url: '/production/honor',
    method: 'get',
    params: query
  })
}




