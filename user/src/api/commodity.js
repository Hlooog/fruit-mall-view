import request from '@/utils/request'

export default {
  getVarietyList(){
    return request({
      url: '/commodity/variety/list',
      method: 'get',
    })
  },
  getCommodity(data){
    return request({
      url: '/commodity/list',
      method: 'post',
      data: data
    })
  },
  getHome(){
    return request({
      url: '/commodity/monthly',
      method: 'get',
    })
  },
  getInfo(id){
    return request({
      url: '/commodity/get/info/' + id,
      method: 'get',
    })
  },
  getComment(id, cur){
    return request({
      url: '/comment/page',
      method: 'get',
      params: {
        id: id,
        cur: cur
      }
    })
  },
  getLike(){
    return request({
      url: '/commodity/like',
      method: 'get'
    })
  },
  keep(id){
    return request({
      url: '/commodity/keep/' + id,
      method: 'put'
    })
  },
  getKeepList(cur){
    return request({
      url: '/commodity/keep/list/' + cur,
      method: 'get'
    })
  },
  cancel(id) {
    return request({
      url: '/commodity/keep/cancel/' + id,
      method: 'put'
    })
  },
}
