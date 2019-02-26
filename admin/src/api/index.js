import request from '@/utils/request'
// 统计表
export function countInfo(query) {
  return request({
    url: '/data/getData',
    method: 'get',
    params: query
  })
}

// 饼状图信息
export function signData(query) {
  return request({
    url: '/data/getSignData',
    method: 'get',
    params: query
  })
}

// 排行榜
export function dataTop(query) {
  return request({
    url: '/data/source',
    method: 'get',
    params: query
  })
}
