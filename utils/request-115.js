export default function(Vue) {
  // 1.刚才演示e：就是Vue构造函数！
  // 2.为了语义好，用Vue形参名字！
  // 3.Vue是构造函数，就有原型对象！不管页面组件、封装组件！都是Vue实例化对象！
  //   只要在原型对象新增设置一些方法，提前配置，在所有Vue实例化对象都可以用！


  // 单独封装符合自己要求请求函数
  Vue.prototype.$request = async function(params) {
    // params:
    //    形参，接受实参是的数据
    //    实参：对象；


    // 开启loading
    uni.showLoading({
      title: "加载中...",
      // mask: true, // 加蒙层，防止触摸穿透！
    });


    //自己要求：
    //    1.统一配置请求根路径
    const base = "https://api-ugo-web.itheima.net";

    //    2.后台返回数据格式提前处理
    let [err, res] = await uni.request({
      url: base + params.url,
      data: params.data
    });


    // 关闭loading效果
    uni.hideLoading();



    return res.data;
  };

}