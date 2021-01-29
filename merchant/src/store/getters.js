const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  id: state => state.user.id,
  phone: state => state.user.phone,
  create: state => state.user.create,
}
export default getters
