import request from '@/utils/request'

export default {
  createCar(data){
    return request({
      url: '/shopCar/add',
      method: 'post',
      data: data
    })
  },
  list() {
    return request({
      url: '/shopCar/list',
      method: 'get'
    })
  },
  increase(id){
    return request({
      url: '/shopCar/increase/' + id,
      method: 'put'
    })
  },
  decrease(id) {
    return request({
      url: '/shopCar/decrease/' + id,
      method: 'put',
    })
  },
  moveOut(id) {
    return request({
      url: '/shopCar/moveOut/' + id,
      method: 'delete'
    })
  },
}
