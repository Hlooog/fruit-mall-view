import request from '@/utils/request'

export default {
  page(page) {
    return request({
      url: '/shop/page',
      method: 'get',
      params: {
        cur: page.cur,
        key: page.key,
        startTime: page.startTime,
        endTime: page.endTime,
        cityId: page.cityId
      }
    })
  },
  banShop(id,days){
    return request({
      url: '/shop/ban',
      method: 'put',
      params: {
        id: id,
        days: days,
      }
    })
  },
  getInfo(id){
    return request({
      url: '/shop/get/' + id,
      method: 'get',
    })
  },
  getCommodityList(id){
    return request({
      url: '/commodity/page/' + id,
      method: 'get',
    })
  },
  offShelf(id){
    return request({
      url: '/commodity/off/' + id,
      method: 'put',
    })
  }
}
