import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/Login.vue'
import home from '../components/Home.vue'
Vue.use(VueRouter)

  const routes = [
  
]

const router = new VueRouter({
  routes:[
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      name:'login',
      component:login
    },
    {
      path:'/home',
      name:'home',
      component:home
    }
  ]
})
//挂在路由导航守卫
router.beforeEach((to,from,next) =>{
  //to代表将要访问的路径
  //from代表从哪个路径跳转而来
  // next 是一个函数，表示方形
  // next（） 方形   next（'/login'） 强制跳转
  const tokenStr = window.sessionStorage.getItem('token');
  if(to.path === '/login'){
    return next();
  } else if(!tokenStr){
    return next("/login");
  }else{
    next();
  }

})

export default router
