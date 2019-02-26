import request from '@/utils/request'

// 素材列表
export function materialList(query) {
  return request({
    url: '/fodder/getList',
    method: 'post',
    params: query
  })
}

// 素材 新增
export function materialAdd(query) {
  return request({
    url: '/fodder/addFodder',
    method: 'post',
    data: query,
    headers: {'Content-Type': 'application/json; charset=UTF-8'},
  })
}

// 素材 新增资源
export function materialAddSource(query) {
  return request({
    url: '/fodder/addFodderSource',
    method: 'post',
    params: query
  })
}


// 素材 修改展示状态
export function materialChangeState(query) {
  return request({
    url: '/fodder/enable',
    method: 'get',
    params: query
  })
}

// 素材 修改展示状态
export function materialChangeinfo(query) {
  return request({
    url: '/fodder/modify',
    method: 'post',
    data: query,
    headers: {'Content-Type': 'application/json; charset=UTF-8'}
  })
}

// 素材 资源类型
export function materialType(query) {
  return request({
    url: '/fodder/productionType/'+query,
    method: 'get'
  })
}

// 素材 类型列表
export function fodderLabels(labelsType) {
  return request({
    url: '/fodder/getFodderTypeList/'+labelsType,
    method: 'get'
  })
}

// 素材 标签列表
export function materialLabels(labelsType) {
  return request({
    url: '/fodder/fodderLabels/'+labelsType,
    method: 'get'
  })
}

// 单个素材标签
export function checkTagOne(query) {
  return request({
    url: '/fodder/getFodderLabes',
    method: 'get',
    params: query
  })
}

// 单个素材作品
export function fodderPro(query) {
  return request({
    url: '/fodder/getFodderProduction',
    method: 'get',
    params: query
  })
}

// 单个素材作品

export function fodderGetOne(query) {
  return request({
    url: '/fodder/getOne',
    method: 'get',
    params: query
  })
}



