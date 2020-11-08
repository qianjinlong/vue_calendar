<template>
  <div id="app">
    <!--
      router-link： 默认会被渲染成一个 <a> 标签，to 属性为指定链接
      router-view： 用于渲染路由匹配到的组件
    -->
    <div :class="top">
      <router-link
        to="/"
        :class="top_nav"
      >首页</router-link>
      <router-link
        to="/Calendar"
        :class="top_nav"
      >显示日历</router-link>
    </div>
    <div :class="main">
      <div :class="main_inner">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
// 导出 NodeJS 对象，作用是可以通过 import 关键字导入
export default {
  name: 'App',
  data () {
    return {
      top: 'top',
      top_nav: 'top_nav',
      main: 'main',
      main_inner: 'main_inner'
    }
  }
}
</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #fff;
}
.top {
  width: 80%;
  height: 60px;
  padding: 0 10%;
  line-height: 60px;
  background-color: #f2f6fc;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: row-reverse;
}
.top_nav {
  width: 80px;
}
.main {
  height: 85%;
  position: relative;
  top: 15%;
}
.main_inner {
  width: 70%;
  padding: 0 15%;
  height: auto;
}
</style>
