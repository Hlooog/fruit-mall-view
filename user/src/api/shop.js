import request from '@/utils/request'

export default {
  page(data){
    return request({
      url: '/shop/user/page',
      method: 'get',
      params: {
        cur: data.cur,
        key: data.key,
        cityId: data.cityId
      }
    })
  },
  list(id) {
    return request({
      url: '/shop/user/list/' + id,
      method: 'get'
    })
  }
}
