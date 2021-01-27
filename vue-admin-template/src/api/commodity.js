import request from '@/utils/request'

export default {
  getList(page) {
    return request({
      url: '/commodity/list',
      method: 'get',
      params: {
        shopId: page.shopId,
        cur: page.cur,
        size: page.size,
        key: page.key,
      }
    })
  },
  getSkuInfo(skuPage) {
    return request({
      url: '/commodityInfo/info',
      method: 'get',
      params: {
        commodityId: skuPage.commodityId,
        cur: skuPage.cur
      }
    })
  },
  offShelf(commodityId) {
    return request({
      url: '/commodity/delete/' + commodityId,
      method: 'delete'
    })
  }
}
