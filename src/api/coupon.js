import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/member/list',
    method:'get',
    params:params
  })
}

export function upload(file) {
  return request({
    url: '/member/batchImport',
    method: 'post',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function addMember(data) {
  return request({
    url:'/member/add',
    method:'post',
    data:data
  })
}

export function createCoupon(data) {
  return request({
    url:'/coupon/create',
    method:'post',
    data:data
  })
}

export function getCoupon(id) {
  return request({
    url:'/coupon/'+id,
    method:'get',
  })
}

export function updateCoupon(id,data) {
  return request({
    url:'/coupon/update/'+id,
    method:'post',
    data:data
  })
}

export function deleteCoupon(id) {
  return request({
    url:'/coupon/delete/'+id,
    method:'post',
  })
}
