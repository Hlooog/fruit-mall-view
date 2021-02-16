import request from '@/utils/request'
import order from "../store/modules/order";

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
  },
  getOrder(orderId){
    return request({
      url: '/orders/get/' + orderId,
      method: 'get'
    })
  },
  queryOrder(orderId){
    return request({
      url: '/orders/query/' + orderId,
      method: 'get',
    })
  },
  applyRefund(id) {
    return request({
      url: '/orders/apply/refund/' + id,
      method: 'put',
    })
  },
  cancel(orderId) {
    return request({
      url: '/orders/cancel/' + orderId,
      method: 'put',
    })
  },
  confirm(id) {
    return request({
      url: '/orders/confirm/' + id,
      method: 'put',
    })
  },
  addComment(data) {
    return request({
      url: '/comment/add',
      method: 'post',
      data: data
    })
  }
}
