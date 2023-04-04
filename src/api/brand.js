import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/admin/api/commend/list',
    method:'post',
    params:params
  })
}
export function createBrand(data) {
  return request({
    url:'/brand/create',
    method:'post',
    data:data
  })
}
export function updateShowStatus(data) {
  return request({
    url:'/brand/update/showStatus',
    method:'post',
    data:data
  })
}

export function updateFactoryStatus(data) {
  return request({
    url:'/brand/update/factoryStatus',
    method:'post',
    data:data
  })
}

export function deleteCommend(id) {
  return request({
    url:'/admin/api/commend/delete?id='+id,
    method:'delete',
  })
}


export function wonderfulCommend(params) {
  return request({
    url:'/admin/api/commend/wonderful',
    method:'post',
    params: params
  })
}


export function getBrand(id) {
  return request({
    url:'/brand/'+id,
    method:'get',
  })
}

export function updateBrand(id,data) {
  return request({
    url:'/brand/update/'+id,
    method:'post',
    data:data
  })
}

