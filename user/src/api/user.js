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
  },
  getInfo(){
    return request({
      url: '/user/get',
      method: 'get'
    })
  },
  edit(data) {
    return request({
      url: '/user/edit',
      method: 'put',
      data: data
    })
  },
  sendMsg(phone) {
    return request({
      url: '/sms/edit/send',
      method: 'get',
      params: {
        phone: phone
      }
    })
  },
  deleteAccount(data){
    return request({
      url: '/user/delete',
      method: 'put',
      data: data
    })
  },
  getAddressList(){
    return request({
      url: '/address/list',
      method: 'get',
    })
  },
  delAddress(id){
    return request({
      url: '/address/delete/' + id,
      method: 'delete',
    })
  },
  addAddress(data) {
    return request({
      url: '/address/add',
      method: 'post',
      data: data
    })
  },
  updateAddress(data){
    return request ({
      url: '/address/edit',
      method: 'put',
      data: data
    })
  }
}
