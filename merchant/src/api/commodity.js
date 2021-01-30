import request from '@/utils/request'

export default {
  getCommodityList(id, cur){
    return request({
      url: '/commodity/page',
      method: 'get',
      params: {
        id: id,
        cur: cur
      }
    })
  }
}
