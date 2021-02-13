import request from '@/utils/request'

export default {
  createCar(data){
    return request({
      url: '/orders/create/car',
      method: 'post',
      data: data
    })
  },
  create(data){
    return request({
      url: '/orders/create',
      method: 'post',
      data: data
    })
  },
  userPage(cur){
    return request({
      url: '/orders/user/page/'+ cur,
      method: 'get'
    })
  }
}
