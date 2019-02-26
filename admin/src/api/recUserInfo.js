import request from '@/utils/request'
// 用户列表
export function userList(query) {
  return request({
    url: '/user/getIsRecList',
    method: 'post',
    params: query
  })
}

// 黑名单列表
export function blackList(query) {
  return request({
    url: '/black/getList',
    method: 'post',
    params: query
  })
}


// 用户艺术细胞
export function art(query) {
  return request({
    url: '/user/art',
    method: 'get',
    params: query
  })
}

// 演艺标签
export function labels(query) {
  return request({
    url: '/user/labels',
    method: 'get',
    params: query
  })
}

// 作品
export function production(query) {
  return request({
    url: '/user/production',
    method: 'get',
    params: query
  })
}

// 荣誉列表
export function honor(query) {
  return request({
    url: '/user/honor',
    method: 'get',
    params: query
  })
}

// 拉黑
export function toBlack(query) {
  return request({
    url: '/user/black',
    method: 'get',
    params: query
  })
}

// 移除拉黑
export function removeBlack(query) {
  return request({
    url: '/black/remove',
    method: 'get',
    params: query
  })
}

// 移除荣誉
export function removeHonor(query) {
  return request({
    url: '/user/removeHonor',
    method: 'get',
    params: query
  })
}

// 推荐
export function changeRec(query) {
  return request({
    url: '/user/isRec',
    method: 'get',
    params: query
  })
}
