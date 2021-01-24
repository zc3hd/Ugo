<template>
  <view>
    <button type="primary" open-type="getUserInfo" @getuserinfo="btn_getInfo">微信登录</button>
  </view>
</template>

<script>
  export default {
    // 策略：看用户是否曾经同意过获取用户信息
    //    从来没有同意：JS方式直接获取不成功，需要等用户自己点击按钮进行获取！
    //    曾经点击同意：JS方式是可以直接获取成功的，不需要用户自己点了！
    

    // JS代码：
    //   
    onLoad(){
      // 1.页面加载，先尝试这用JS api方式去获取下用户信息；
      this.api_getInfo();
    },
    methods:{
      // JS方式
      async api_getInfo(){
        const [err,res] =  await uni.getUserInfo();
        
        if (!res) {
          return;  // JS这个方式到此为止！接下来需要等待用户主动点击按钮，进行获取！
        }

        // res   用户信息
        this.get_token(res);


      },
      // 2. btn方式：等待用户去主动自己点击
      btn_getInfo(e){
        // e.detail   用户信息；

        this.get_token(e.detail);
      },
      // *******************************殊途同归,最终两种方式都是来到获取token
      async get_token(obj){
        // 发送请求需要的数据：
        // - code：
        // - encryptedData
        // - iv
        // - rawData
        // - signature

        // 1.发送数据一部分：用户信息obj
         let {encryptedData,iv,rawData,signature} = obj;

        // 2.code  原生：wx.login()；
        const [err,res] =  await uni.login();
        // res.code

        // 发送请求，获取最终token数据
        const {message}  = await this.$request({
          url:"/api/public/v1/users/wxlogin",
          method:"POST",
          data:{
            encryptedData,
            iv,
            rawData,
            signature,
            code:res.code
          }
        });

        // message:null,基于小程序是基于我自己的小程序！
        // 获取token接口：专门对于我们学校小程序公用小程序设计的！
        //                需要大家到了公司肯定用的不是自己小程序！用的是公司小程序账号！
        //                问题：同学们能使用么黑马学校小程序的id?  不能用！大家不是我们开发人员！
        // 当能够获取数据的时候
        if (message!=null) {
          uni.setStorageSync("token",message.token);
          // 回到上一个路由：
          uni.navigateBack();
        }
  

      


      }
    }




  }
</script>

<style lang="less" scoped>
  button {
    width: 600rpx;
    margin: 200rpx auto 0;
  }
</style>