import request from '@/utils/request'

export function userList(query) {
  return request({
    url: '/transaction/list',
    method: 'get',
    params: query
  })
}
