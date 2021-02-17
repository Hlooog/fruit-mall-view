import request from '@/utils/request'

export default {
  getInfo(){
    return request({
      url: '/city/info',
      method: 'get',
    })
  }
}
