<template>
  <!-- 建议：标签使用原生小程序的组件 -->
  <div class="search" :class="{focused: focused}">

    <!-- 搜索框 -->
    <div class="input-wrap" @click="goSearch">
      <input type="text" 
        :placeholder="placeholder" 
        v-model="query" 
        @input="input"
        @confirm="confirm">
      <span class="cancle" @click.stop="cancleSearch">取消</span>
    </div>

    <!-- 搜索结果 -->
    <div class="content">
      <div class="title">搜索历史
        <span class="clear" @tap="remove"></span>
      </div>
      <!-- 曾经咱们搜索历史记录 -->
      <div class="history">
        <navigator url="/pages/list/index" v-for="(item,index) in history" :key="index">{{item}}</navigator>
      </div>


      <!-- 现在：正在搜索的话，显示建议列表 -->
      <scroll-view scroll-y class="result" v-if="list.length">
        <navigator :url="'/pages/goods/index?id='+item.goods_id" v-for="(item,index) in list" :key="index">{{item.goods_name}}</navigator>
      </scroll-view>


    </div>


  </div>
</template>

<script>
  export default {
    data () {
      return {
        focused: false,
        placeholder: '',
        query:"",
        list:[],
        // 初始化的时候，获取本地历史数据
        history:uni.getStorageSync("history")||[],
      }
    },
    methods: {
      // 进入聚焦状态
      goSearch (ev) {
        this.focused = true;
        this.placeholder = '请输入您要搜索的内容';
        
        // 触发父组件自定义事件
        this.$emit('search', {
          pageHeight: uni.getSystemInfoSync().windowHeight
        });

        // 隐藏tabBar
        uni.hideTabBar();
      },
      // 取消
      cancleSearch () {
        this.focused = false;
        this.placeholder = '';

        // 触发父组件自定义事件
        this.$emit('search', {
          pageHeight: 'auto'
        });

        // 显示tabBar
        uni.showTabBar();
      },
      // 前置：
      // 1.@input 正在输入的时候，执行这个事件
      // 2.获取输入框的数据？input指令 v-model
      async input(){
        // 1.发起请求 解构赋值，必须后台返回的数据约定格式
        const {message} = await this.$request({
          url:"/api/public/v1/goods/qsearch",
          data:{
            query:this.query
          }
        });

        // 2.进行赋值
        this.list = message;
        console.log(this.list);
      },
      // 点击手机键盘上确认按钮
      confirm(){
        // ***********************************1.添加搜索关键字到本地
        // - 1.获取本地数据（放入this.history)，查看本地是否有数据，没有就赋值为 []
        // this.history;

        // - 2.把刚才确认 搜索的数据 添加到数组中；
        this.history.push(this.query);


        //   优化：数组去重处理！
        this.history = [...new Set(this.history)];

        // - 3.把处理后数据，再次存入本地！
        uni.setStorageSync("history",this.history);


        // ***********************************2.页面转跳
        uni.navigateTo({
          url:"/pages/list/index?query=" + this.query
        });
      },
      remove(){
        // 1.只是清除了本地历史记录
        uni.removeStorageSync("history");

        // 2.需要手动改变 this.history；
        this.history = [];
      }
    }
  }
</script>

<style lang="less" scoped>
  .search {
    display: flex;
    flex-direction: column;
    
    // 搜索框
    .input-wrap {
      display: flex;
      height: 100rpx;
      padding: 20rpx 30rpx;
      background-color: #ea4451;
      box-sizing: border-box;
      position: relative;

      &::before,
      &::after {
        height: 44rpx;
        line-height: 1;
        background-image: url(http://static.botue.com/ugo/images/icon_search%402x.png);
        background-size: 32rpx;
        background-position: 6rpx center;
        background-repeat: no-repeat;

        position: absolute;
        top: 28rpx;
        z-index: 9;
      }

      &::before {
        content: '搜索';
        display: block;

        width: 100rpx;
        padding: 11rpx 0 10rpx 44rpx;
        box-sizing: border-box;
        color: #666;
        font-size: 24rpx;
        left: 325rpx;
      }

      &::after {
        display: none;
        content: '';
        width: 44rpx;
        left: 40rpx;
      }

      input {
        flex: 1;
        height: 60rpx;
        padding: 0 20rpx 0 64rpx;
        background-color: #fff;
        border-radius: 8rpx;
        font-size: 24rpx;
        color: #666;
      }

      span.cancle {
        display: none;
        width: 80rpx;
        text-align: right;
        line-height: 60rpx;
        font-size: 27rpx;
        color: #666;
      }
    }

    // 搜索结果
    .content {
      display: none;
      flex: 1;
      padding: 27rpx;
      background-color: #fff;
      position: relative;

      .title {
        font-size: 27rpx;
        line-height: 1;
        color: #333;
      }

      .clear {
        display: block;
        width: 27rpx;
        height: 27rpx;
        float: right;
        background-image: url(http://static.botue.com/ugo/images/clear.png);
        background-size: cover;
      }

      .history {
        padding-top: 30rpx;

        navigator {
          display: inline-block;
          line-height: 1;
          padding: 15rpx 20rpx 12rpx;
          background-color: #ddd;
          font-size: 24rpx;
          margin-right: 20rpx;
          margin-bottom: 15rpx;
          color: #333;
        }
      }

      .result {
        // display: none;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: #fff;

        navigator {
          line-height: 1;
          padding: 20rpx 30rpx;
          font-size: 24rpx;
          color: #666;
          border-bottom: 1px solid #eee;

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
    
    // 获得焦点状态
    &.focused {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 9;

      .input-wrap {
        background-color: #eee;

        &::before {
          display: none;
        }

        &::after {
          display: block;
        }
      }

      span.cancle {
        display: block;
      }

      .content {
        display: block;
      }
    }
  }
</style>