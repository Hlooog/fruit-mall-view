import request from '../utils/request'

export default {
  apply(data){
    return request({
      url: '/merchantInfo/apply',
      method: 'post',
      data: data
    })
  },
  getApply(){
    return request({
      url: '/merchantInfo/get',
      method: 'get',
    })
  }
}
