import request from '@/utils/request'

export default {
  page(data){
    return request({
      url: '/orders/merchant/page',
      method: 'get',
      params: {
        shopId: data.shopId,
        userId: data.userId,
        startTime: data.startTime,
        endTime: data.endTime,
        cur: data.cur,
        status: data.status,
      }
    })
  },
  ship(data) {
    return request({
      url: '/orders/ship',
      method: 'put',
      data: data
    })
  },
  exportData(data) {
    return request({
      url: '/orders/merchant/export',
      method: 'get',
      params: {
        shopId: data.shopId,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
      }
    })
  },
  agree(id){
    return request({
      url: '/orders/agree/' + id,
      method: 'put',
    })
  },
  refuse(id){
    return request({
      url: '/orders/refuse/' + id,
      method: 'put'
    })
  }
}
