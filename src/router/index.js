import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/news/list'
  }
]

export const asyncRouterMap = [
  {
    path: '/news',
    component: Layout,
    redirect: '/news/list',
    name: 'news',
    meta: {title: '新闻发布管理系统', icon: 'product'},
    children: [{
      path: 'list',
      name: 'list',
      component: () => import('@/views/pms/product/index'),
      meta: {title: '新闻发布管理系统', icon: 'product-list'}
    },
      {
        path: 'add',
        name: 'add',
        component: () => import('@/views/pms/product/add'),
        meta: {title: '添加新闻', icon: 'product-add'}
      },
      {
        path: 'edit',
        name: 'edit',
        component: () => import('@/views/pms/product/update'),
        meta: {title: '编辑新闻', icon: 'product-add'},
        hidden: true
      },
      {
        path: 'detail',
        name: 'detail',
        component: () => import('@/views/pms/product/detail'),
        meta: {title: '查看新闻', icon: 'product-add'},
        hidden: true
      },
      {
        path: 'commend',
        name: 'commend',
        component: () => import('@/views/pms/brand/index'),
        meta: {title: '留言精选', icon: 'product-brand'}
      }
    ]
  },
  {
    path:'/sms',
    component: Layout,
    redirect: '/sms/member',
    name: 'sms',
    meta: {title: '会员列表', icon: 'sms'},
    children: [
      {
        path: 'member',
        name: 'member',
        component: () => import('@/views/sms/coupon/index'),
        meta: {title: '会员列表', icon: 'sms-coupon'}
      }
    ]
  },
  {
    path:'/ums',
    component: Layout,
    redirect: '/ums/admin',
    name: 'ums',
    meta: {title: '权限', icon: 'ums'},
    children: [
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/ums/admin/index'),
        meta: {title: '用户列表', icon: 'ums-admin'}
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/ums/role/index'),
        meta: {title: '角色列表', icon: 'ums-role'}
      },
      {
        path: 'allocMenu',
        name: 'allocMenu',
        component: () => import('@/views/ums/role/allocMenu'),
        meta: {title: '分配菜单'},
        hidden: true
      },
      {
        path: 'allocResource',
        name: 'allocResource',
        component: () => import('@/views/ums/role/allocResource'),
        meta: {title: '分配资源'},
        hidden: true
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/ums/menu/index'),
        meta: {title: '菜单列表', icon: 'ums-menu'}
      },
      {
        path: 'addMenu',
        name: 'addMenu',
        component: () => import('@/views/ums/menu/add'),
        meta: {title: '添加菜单'},
        hidden: true
      },
      {
        path: 'updateMenu',
        name: 'updateMenu',
        component: () => import('@/views/ums/menu/update'),
        meta: {title: '修改菜单'},
        hidden: true
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import('@/views/ums/resource/index'),
        meta: {title: '资源列表', icon: 'ums-resource'}
      },
      {
        path: 'resourceCategory',
        name: 'resourceCategory',
        component: () => import('@/views/ums/resource/categoryList'),
        meta: {title: '资源分类'},
        hidden: true
      }
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

