import request from '@/utils/request'

// 作品类型列表
export function proTypeList(query) {
  return request({
    url: '/productionType/getList',
    method: 'post',
    params: query
  })
}

// 作品类型列表
export function proEnable(query) {
  return request({
    url: '/productionType/enable',
    method: 'get',
    params: query
  })
}

// 作品类型 新增
export function proAdd(query) {
  return request({
    url: '/productionType/add',
    method: 'post',
    data: query,
    headers: {'Content-Type': 'application/json; charset=UTF-8'},
  })
}

// 作品类型 编辑
export function proModify(query) {
  return request({
    url: '/productionType/modify',
    method: 'post',
    data: query,
    headers: {'Content-Type': 'application/json; charset=UTF-8'},
  })
}

