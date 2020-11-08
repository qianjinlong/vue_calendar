import Vue from 'vue'
// 导入路由插件
import Router from 'vue-router'
// 导入上面定义的组件
import Calendar from '@/components/Calendar'
import Main from '@/components/Main'

// 安装路由
Vue.use(Router)

// 配置路由
export default new Router({
  routes: [
    {
      // 路由路径
      path: '/',
      // 路由名称
      name: 'Main',
      // 跳转到组件
      component: Main
    }, {
      path: '/Calendar',
      name: 'Calendar',
      component: Calendar
    }
  ]
})
