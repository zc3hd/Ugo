import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'


// 配置插件的基本步骤：
// 1.Vue：是个构造函数
// 2.Vue.use() 基本用法和曾经大家的学习不冲突！内部事件对象就是Vue！
// 3.统一配置请求根路径，后台返回数据格式提前处理：封装插件！
//     3.1 单独定义JS文件、导出；
//     3.2 在主JS文件内导入，注册使用！
import request from "./utils/request-115.js";
Vue.use(request);



const app = new Vue({
  ...App
})




app.$mount()