import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/Login.vue'
import home from '../components/Home.vue'
import welcome from '../components/Welcome.vue'
import users from '../components/user/Users.vue'
import rights from '../components/power/Rights.vue'
import roles from '../components/power/Roles.vue'

Vue.use(VueRouter)

const routes = [

]

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      redirect: '/welcome',
      children: [{
        path: '/welcome',
        name: 'welcome',
        component: welcome
      },
      {
        path: '/users',
        name: 'users',
        component: users
      },
      {
        path: '/rights',
        name: 'rights',
        component: rights
      },
      {
        path: '/roles',
        name: 'roles',
        component: roles
      }
      ],
    }
  ]
})
//挂在路由导航守卫
router.beforeEach((to, from, next) => {
  //to代表将要访问的路径
  //from代表从哪个路径跳转而来
  // next 是一个函数，表示方形
  // next（） 方形   next（'/login'） 强制跳转
  const tokenStr = window.sessionStorage.getItem('token');
  if (to.path === '/login') {
    return next();
  } else if (!tokenStr) {
    return next("/login");
  } else {
    next();
  }

})

export default router
