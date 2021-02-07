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
      url: '/commodity/home',
      method: 'get',
    })
  }
}
