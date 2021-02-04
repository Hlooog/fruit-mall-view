import request from '../utils/request'
import md5 from 'js-md5'


export default {
  login(data) {
    data.password = md5(data.password)
    return request({
      url: '/general/login',
      method: 'post',
      data: data
    })
  },
  logout(){
    return request({
      url: '/logout',
      method: 'get',
    })
  },
  send(phone){
    return request({
      url: '/sms/login/send',
      method: 'get',
      params: {
        phone: phone
      }
    })
  },
  smsLogin(data){
    return request({
      url: '/sms/login',
      method: 'post',
      data: data
    })
  },
  wxLogin(uuid){
    return request({
      url: '/wx/login/' + uuid,
      method: 'get'
    })
  },
  register(data){
    data.password = md5(data.password)
    return request({
      url: '/register',
      method: 'post',
      data: data
    })
  }
}
