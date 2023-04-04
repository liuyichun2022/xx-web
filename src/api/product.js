import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/news/list',
    method:'get',
    params:params
  })
}

export function fetchSimpleList(params) {
  return request({
    url:'/product/simpleList',
    method:'get',
    params:params
  })
}

export function updateDeleteStatus(params) {
  return request({
    url:'/product/update/deleteStatus',
    method:'post',
    params:params
  })
}

export function updateNewStatus(params) {
  return request({
    url:'/product/update/newStatus',
    method:'post',
    params:params
  })
}

export function updatePublishStatus(params) {
  return request({
    url:'/product/update/publishStatus',
    method:'post',
    params:params
  })
}

export function createProduct(data) {
  return request({
    url:'/product/create',
    method:'post',
    data:data
  })
}

export function updateProduct(id,data) {
  return request({
    url:'/product/update/'+id,
    method:'post',
    data:data
  })
}

export function getProduct(id) {
  return request({
    url:'/product/updateInfo/'+id,
    method:'get',
  })
}

export function createNews(data) {
  return request({
    url:'/news/add',
    method:'post',
    data:data
  })
}

export function getNewsById(id) {
  return request({
    url:'/news/getDetail/'+id,
    method:'get'
  })
}

export function publish(params) {
  return request({
    url:'/news/publish',
    method:'post',
    params: params
  })
}

export function updateCommendStatus(params) {
  return request({
    url:'/news/update/commendStatus',
    method:'post',
    params: params
  })
}


export function deleteNews(params) {
  return request({
    url:'/news/delete',
    method:'post',
    params: params
  })
}

