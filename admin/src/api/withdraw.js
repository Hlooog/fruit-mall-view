import request from '@/utils/request'

export default {
  page(data){
    return request({
      url: '/withdraw/page',
      method: 'get',
      params: {
        cur: data.cur,
        phone: data.phone,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status
      }
    })
  },
  review(id,shopId,phone){
    return request({
      url: '/withdraw/review',
      method: 'put',
      params: {
        id: id,
        shopId: shopId,
        phone: phone
      }
    })
  },
  refuse(id,shopId,phone){
    return request({
      url: '/withdraw/refuse',
      method: 'put',
      params: {
        id: id,
        shopId: shopId,
        phone: phone
      }
    })
  }
}
