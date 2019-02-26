import request from '@/utils/request'


export function upLoad(query) {
  return request({
    url: 'https://file.niyouxi77.com/files/upload',
    method: 'post',
    params: query
  })
}
