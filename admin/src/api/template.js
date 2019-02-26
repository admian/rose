import request from '@/utils/request'

// 模板列表
export function templateList(query) {
  return request({
    url: '/template/getList',
    method: 'post',
    params: query
  })
}

export function templateAdd(query) {
  return request({
    url: '/template/add',
    method: 'post',
    data: query, // 传递数据为 request payload时  需要加以下请求头，参数从 params 改为 data
    headers: {'Content-Type': 'application/json; charset=UTF-8'},
  })
}

export function templateChange(query) {
  return request({
    url: '/template/modify',
    method: 'post',
    data: query, // 传递数据为 request payload时  需要加以下请求头，参数从 params 改为 data
    headers: {'Content-Type': 'application/json; charset=UTF-8'},
  })
}

export function templateDel(query) {
  return request({
    url: '/template/delete/'+query,
    method: 'get'
  })
}





