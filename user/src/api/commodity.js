import request from '@/utils/request'
import id from "element-ui/src/locale/lang/id";

export default {
  getVarietyList(){
    return request({
      url: '/commodity/variety/list',
      method: 'get',
    })
  },
  getCommodity(data){
    return request({
      url: '/commodity/list',
      method: 'post',
      data: data
    })
  },
  getHome(){
    return request({
      url: '/commodity/home',
      method: 'get',
    })
  },
  getInfo(id){
    return request({
      url: '/commodity/get/info/' + id,
      method: 'get',
    })
  },
  getComment(id, cur){
    return request({
      url: '/comment/page',
      method: 'get',
      params: {
        id: id,
        cur: cur
      }
    })
  }
}
