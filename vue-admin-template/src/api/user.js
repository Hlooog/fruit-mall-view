import request from '@/utils/request'
import md5 from 'js-md5'

export function login(data) {
  data.password = md5(data.password)
  return request({
    url: '/admin/login',
    method: 'post',
    params: {
      phone: data.phone,
      password: data.password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/na',
    method: 'get',
    params: {token}
  })
}

export function logout(token) {
  return request({
    url: '/logout',
    method: 'get',
  })
}

export default {
  getGeneralList(page) {
    return request({
      url: '/user/page/general',
      method: 'get',
      params:{
        cur: page.cur,
        startTime: page.startTime,
        endTime: page.endTime,
        key: page.key,
      }
    })
  },
  banUser(id,days){
    return request({
      url: '/user/ban/general',
      method: 'put',
      params: {
        id: id,
        days: days,
      }
    })
  },
  setService(id){
    return request({
      url: '/user/service/' + id,
      method: 'put',
    })
  },

  getMerchantList(page){
    return request({
      url: '/user/page/merchant',
      method: 'get',
      params:{
        cur: page.cur,
        startTime: page.startTime,
        endTime: page.endTime,
        key: page.key,
      }
    })
  },

  banMerchant(id,days){
    return request({
      url: '/user/ban/merchant',
      method: 'put',
      params: {
        id: id,
        days: days,
      }
    })
  },

  review(id){
    return request({
      url: '/merchantInfo/review/' + id,
      method: 'put',
    })
  },
  getApply(cur,status){
    return request({
      url: '/merchantInfo/list/review',
      method: 'get',
      params: {
        cur: cur,
        status: status,
      }
    })
  },
  refuse(id){
    return request({
      url: '/merchantInfo/refuse/' + id,
      method: 'put',
    })
  }
}
