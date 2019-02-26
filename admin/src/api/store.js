import request from '@/utils/request'
// 故事列表
export function storeList(query) {
  return request({
    url: '/story/getList',
    method: 'post',
    params: query
  })
}

// 故事 发布、下架
export function storeEnable(query) {
  return request({
    url: '/story/enable',
    method: 'get',
    params: query
  })
}

// 故事评论
export function storeComment(query) {
  return request({
    url: '/story/evaluate',
    method: 'get',
    params: query
  })
}

// 故事评论、回复状态 设置
export function storeReplyState(query) {
  return request({
    url: '/story/replyEnable',
    method: 'get',
    params: query
  })
}

// 故事评论、回复状态 设置
export function storeReplyList(query) {
  return request({
    url: '/story/reply',
    method: 'get',
    params: query
  })
}

// 故事详情
export function storedet(query) {
  return request({
    url: '/story/details',
    method: 'get',
    params: query
  })
}


