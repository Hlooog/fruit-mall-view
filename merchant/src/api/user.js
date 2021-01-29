import request from '@/utils/request'
import md5 from 'js-md5'

export function login(data) {
  data.password = md5(data.password)
  return request({
    url: '/merchant/login',
    method: 'post',
    data
  })
}

/*export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}*/

export function logout() {
  return request({
    url: '/logout',
    method: 'get',
  })
}

export default {

}
