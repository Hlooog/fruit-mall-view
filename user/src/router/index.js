import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/layout'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/',
    component: layout,
    children: [
      {
        path: '/',
        component: () => import('@/pages/home/index'),
        meta: {title: '首页'}
      }
    ]
  },
  {
    path: '/apply',
    component: layout,
    children: [
      {
        path: 'index',
        component: () => import('@/pages/apply/index'),
        meta: {title: '申请成为商家'}
      },
    ]
  },

  {
    path: '/service',
    component: layout,
    children: [
      {
        path: 'index',
        component: () => import('@/pages/service/index'),
        meta: {title: '在线客服'}
      }
    ]
  },

  {
    path: '/user',
    component: layout,
    children: [
      {
        path: 'index',
        component: () => import('@/pages/user/index'),
        meta: {title: '个人中心'}
      }
    ]
  },
  {
    path: '/commodity',
    component: layout,
    children: [
      {
        path: 'index',
        component: () => import('@/pages/commodity/index'),
        meta: {title: '所有商品'}
      },
      {
        path: 'info',
        component: () => import("@/pages/commodity/info"),
        meta: {title: '商品详情'}
      }
    ]
  },

  {
    path: '/car',
    component: layout,
    children: [
      {
        path: 'index',
        component: ()=> import('@/pages/car/index'),
        meta: {title: '购物车'}
      },
    ]
  },

  {
    path: '/order',
    component: layout,
    children: [
      {
        path: 'index',
        component: ()=> import('@/pages/order/index'),
        meta: {title: '我的订单'}
      },
    ]
  },

  {
    path: '/pay',
    component: layout,
    children: [
      {
        path: 'index',
        component: ()=> import('@/pages/pay/index'),
        meta: {title: '支付'}
      },
    ]
  },

  {
    path: '/login',
    component: () => import('@/pages/login/index'),
    meta: {title: '登录'}
  },
  {
    path: '/register',
    component: () => import('@/pages/login/register'),
    meta: {title: '注册'}
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'history',
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
