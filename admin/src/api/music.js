import request from '@/utils/request'

// 音乐列表
export function musicList(query) {
  return request({
    url: '/music/list',
    method: 'post',
    params: query
  })
}

// 音乐标签列表
export function musicTypeList(query) {
  return request({
    url: '/music/typeList',
    method: 'post',
    params: query
  })
}

// 音乐编辑
export function musicModify(query) {
  return request({
    url: '/music/modify',
    method: 'post',
    data: query,
    headers: {'Content-Type': 'application/json; charset=UTF-8'}
  })
}

// 音乐新增
export function musicAdd(query) {
  return request({
    url: '/music/add',
    method: 'post',
    data: query,
    headers: {'Content-Type': 'application/json; charset=UTF-8'}
  })
}
