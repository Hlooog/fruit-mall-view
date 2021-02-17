import Vue from 'vue'

const state = sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')).order :{
  data: {}
}

const mutations = {
  SET_ORDER: (state,order) => {
    let data = {
      time: order.time,
      codeUrl: order.codeUrl,
      price: order.price,
    }
    state.data[order.orderId] = data
    Vue.set(state.data,order.orderId,data)
  },
  DEL_ORDER: (state,orderId) => {
    delete state.data[orderId]
  },
  DECREASE: (state,orderId) => {
    // 超简易拷贝（如果是深拷贝还多此一举把get/set拷贝进去了，所以用简易拷贝即可）
    let __VALUE__ = JSON.parse(JSON.stringify(state.data))
    // 加入部门回复详情
    let data = __VALUE__[orderId]
    data.time = data.time - 1
    __VALUE__[orderId] = data
    // 更新，只能这样一波骚操作才能让computed和watch监听到。具体原因我稍后学习o(╥﹏╥)o。
    state.data = __VALUE__
  }
}

const actions = {
  setOrder( {commit}, order) {
    commit('SET_ORDER', order)
  },

  decrease({commit}, orderId){
    commit('DECREASE', orderId)
  },
  delOrder({commit}, orderId){
    commit('DEL_ORDER', orderId)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
