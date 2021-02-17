const state = sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')).shop : {
  info: {}
}

const mutations = {
  SET_INFO: (state, info) => {
    state.info = {}
    state.info = info
  }
}

const actions = {
  setShop({commit}, info) {
    commit('SET_INFO', info)
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
