import request from '@/utils/request'

export default {
  getInfo(id){
    return request({
      url: '/shop/getInfo/' + id,
      method: 'get'
    })
  },
  CreateOrUpdate(data,id){
    return request({
      url: '/shop/createOrUpdate',
      method: 'post',
      data: data,
      params: {
        id: id
      }
    })
  },
}
