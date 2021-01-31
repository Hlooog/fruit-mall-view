import request from '@/utils/request'

export default {
  getCommodityList(id, cur) {
    return request({
      url: '/commodity/page',
      method: 'get',
      params: {
        id: id,
        cur: cur
      }
    })
  },
  getInfoList(id) {
    return request({
      url: '/commodity/info/list/' + id,
      method: 'get'
    })
  },
  up(id) {
    return request({
      url: '/commodity/up/' + id,
      method: 'put',
    })
  },
  off(id) {
    return request({
      url: '/commodity/off/' + id,
      method: 'put',
    })
  },
  deleteCommodity(id) {
    return request({
      url: '/commodity/delete/' + id,
      method: 'delete'
    })
  },
  getInfo(id) {
    return request({
      url: '/commodity/get/' + id,
      method: 'get',
    })
  },
  getVariety(){
    return request({
      url: '/commodity/variety/get',
      method: 'get'
    })
  },
  update(data){
    return request({
      url: '/commodity/edit',
      method: 'put',
      data: data,
    })
  },
  create(data){
    return request({
      url: '/commodity/create',
      method: 'post',
      data: data
    })
  },
  insertVariety(val) {
    return request({
      url: '/commodity/variety/insert',
      method: 'post',
      params: {
        name: val
      }
    })
  },

  infoCreate(data) {
    return request({
      url: '/commodity/info/create',
      method: 'post',
      data: data
    })
  },
  infoEdit(data) {
    return request({
      url: '/commodity/info/edit',
      method: 'put',
      data: data
    })
  },
  infoDelete(id) {
    return request({
      url: '/commodity/info/delete/' + id,
      method: 'delete'
    })
  },
  infoGet(id) {
    return request({
      url: '/commodity/info/get/' + id,
      method: 'get'
    })
  }
}
