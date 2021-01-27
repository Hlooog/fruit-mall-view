import request from '@/utils/request'

export default {
  page(page) {
    return request({
      url: '/shop/page',
      method: 'get',
      params: {
        cur: page.cur,
        size: page.size,
        key: page.key,
        startTime: page.startTime,
        endTime: page.endTime,
        cityId: page.cityId
      }
    })
  },
  mute(shopId, degree) {
    return request({
      url: '/shop/mute',
      method: 'put',
      params: {
        shopId: shopId,
        degree: degree
      }
    })
  }
}
