const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  id: state => state.user.id,
  phone: state => state.user.phone,
  data: state => state.order.data
}
export default getters
