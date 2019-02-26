import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '控制面板', icon: 'dashboard', noCache: true, roles: ['admin', 'editor'] }
      }
    ]
  }

]

export default new Router({
/*
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
*/
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    alwaysShow: true,
    meta: {
      title: '用户管理',
      icon: 'documentation',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/user/list'),
        name: 'UserList',
        meta: {
          title: '用户列表',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'recList',
        component: () => import('@/views/user/recList'),
        name: 'recList',
        meta: {
          title: '推荐用户',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'blacklist',
        component: () => import('@/views/user/blacklist'),
        name: 'UserBlacklist',
        meta: {
          title: '黑名单',
          roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/works',
    component: Layout,
    redirect: '/works/list',
    alwaysShow: true,
    meta: {
      title: '作品管理',
      icon: 'component',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/works/list'),
        name: 'WorksList',
        meta: {
          title: '作品列表',
          roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/store',
    component: Layout,
    redirect: '/store/list',
    alwaysShow: true,
    meta: {
      title: '故事管理',
      icon: 'chart',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/store/list'),
        name: 'StoreList',
        meta: {
          title: '故事列表',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'comment',
        component: () => import('@/views/store/comment'),
        name: 'StoreComment',
        hidden: true,
        meta: {
          title: '评论列表',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'reply',
        component: () => import('@/views/store/reply'),
        name: 'StoreReply',
        hidden: true,
        meta: {
          title: '回复列表',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'details',
        component: () => import('@/views/store/details'),
        name: 'StoreDetails',
        hidden: true,
        meta: {
          title: '故事详情',
          roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/list',
    alwaysShow: true,
    meta: {
      title: '活动管理',
      icon: 'icon',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/activity/list'),
        name: 'ActivityList',
        meta: {
          title: '活动列表',
          roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/content',
    component: Layout,
    redirect: '/content/list',
    alwaysShow: true,
    meta: {
      title: '内容管理',
      icon: 'edit',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/content/list'),
        name: 'ContentList',
        meta: {
          title: '平台标签',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'productionType',
        component: () => import('@/views/content/productionType'),
        name: 'prorList',
        meta: {
          title: '作品类型管理',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'banner',
        component: () => import('@/views/content/banner'),
        name: 'BannerList',
        meta: {
          title: 'banner管理',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'advert',
        component: () => import('@/views/content/advert'),
        name: 'advertList',
        meta: {
          title: '广告位管理',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'template',
        component: () => import('@/views/content/template'),
        name: 'templates',
        meta: {
          title: '初始化模板',
          roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/material',
    component: Layout,
    redirect: '/material/list',
    alwaysShow: true,
    meta: {
      title: '素材管理',
      icon: 'list',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/material/list'),
        name: 'MaterialList',
        meta: {
          title: '素材列表',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'music',
        component: () => import('@/views/material/music'),
        name: 'MusicList',
        meta: {
          title: '音乐管理',
          roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/musicType',
    component: Layout,
    redirect: '/musicType/list',
    alwaysShow: true,
    meta: {
      title: '音乐类型',
      icon: 'music',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/musicType/list'),
        name: 'MaterialList',
        meta: {
          title: '素材列表',
          roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/auditing',
    component: Layout,
    redirect: '/auditing/list',
    alwaysShow: true,
    meta: {
      title: '审核中心',
      icon: 'international',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/auditing/list'),
        name: 'AuditinglList',
        meta: {
          title: '举报列表',
          roles: ['admin', 'editor']
        }
      },
      {
        path: 'musicor',
        component: () => import('@/views/auditing/musicor'),
        name: 'AuditinglList',
        meta: {
          title: '音乐达人审核',
          roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: '/auditing/list',
    alwaysShow: true,
    meta: {
      title: '系统管理',
      icon: 'theme',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/sys/list'),
        name: 'AdminList',
        meta: {
          title: '管理员列表'
        }
      },
      {
        path: 'log',
        component: () => import('@/views/sys/log'),
        name: 'AdminLog',
        meta: {
          title: '操作日志'
        }
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    redirect: '/auditing/list',
    alwaysShow: true,
    hidden: true,
    meta: {
      title: '上传测试',
      icon: 'theme',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'test',
        component: () => import('@/views/test/test'),
        name: 'test',
        meta: {
          title: '管理员列表'
        }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    hidden: true,
    meta: {
      title: '权限测试',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: '权限页面',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: '权限条件'
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
