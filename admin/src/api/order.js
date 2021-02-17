import request from '@/utils/request'

export default {
  export(data) {
    return request({
      url: '/orders/admin/export',
      method: 'get',
      params: {
        startTime: data.startTime,
        endTime: data.endTime
      }
    })
  },
  page(data){
    return request({
      url: '/orders/admin/page',
      method: 'get',
      params: {
        cur: data.cur,
        id: data.id,
        startTime: data.startTime,
        endTime: data.endTime,
        type: data.type
      }
    })
  },
  agree(id){
    return request({
      url: '/orders/agree/' + id,
      method: 'put',
    })
  },

  numberReport(){
    return request({
      url: '/orders/admin/number/report',
      method: 'get',
    })
  },

  priceReport(){
    return request({
      url: '/orders/admin/price/report',
      method: 'get',
    })
  }
}
