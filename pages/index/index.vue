<template>
  <view :style="{height: pageHeight, overflow: 'hidden'}">
    <search @search="disableScroll" />


    <!-- 焦点图 -->
    <swiper class="banner" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <swiper-item v-for="item in arrSwiper" :key="item.goods_id">
        <navigator :url="'/pages/goods/index?id='+item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>



    <!-- 导航条 -->
    <view class="navs">
      <navigator open-type="switchTab" url="" v-for="item in arrNav" :key="item.name">
        <image :src="item.image_src"></image>
      </navigator>
    </view>


    <!-- 楼层 -->
    <view class="floors">

      <view class="floor" v-for="(one,index) in arrFloor" :key="index">

        <!-- 每个楼层的头部地址 -->
        <view class="title">
          <image :src="one.floor_title.image_src"></image>
        </view>

        <!-- 商品每个信息 -->
        <view class="items">
          <navigator url="/pages/list/index" v-for="good in one.product_list" :key="good.name">
            <image :src="good.image_src"></image>
          </navigator>
        </view>
      </view>

    </view>


    <!-- 回到顶部 -->
    <view class="goTop icon-top"></view>



  </view>
</template>

<script>
  // 1.导入
  import search from '@/components/search';

  export default {

    data () {
      return {
        pageHeight: 'auto',
        // 轮播图初始化
        arrSwiper:[],
        // 导航数据
        arrNav:[],
        // 楼层数据
        arrFloor:[]
      }
    },
    // 2.注册：
    components: {
      search
    },
    // 监听页面加载
    onLoad(){
      // 请求轮播图数据写在这？可以！ 但是最好还是写在methods里面，代码便于维护！
      //   
      this.get_swiper();

      this.get_nav();

      this.get_floor();

      // 开启转发功能
      // uni.showShareMenu();
    },
    onShareAppMessage(){
      return {
        title: '来传智，学前端，成赢家!',
        path:"/pages/index/index",
        imageUrl:"https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1089874897,1268118658&fm=26&gp=0.jpg"
      };
    },
    // 监听下拉刷新东西
    async onPullDownRefresh(){

      // 1.让所有的请求重新执行下
      await this.get_swiper();

      await this.get_nav();

      await this.get_floor();

      // 2.在所有请求之后，关闭效果；API
      uni.stopPullDownRefresh();
    },
    // 
    methods: {
      disableScroll (ev) {
        this.pageHeight = ev.pageHeight + 'px';
      },
      // 轮播图
      async get_swiper(){
        // ************************************************封装插件前：
        // 1.ES7 数据请求
        // let [err,data] =  await uni.request({
        //   url:"https://api-ugo-web.itheima.net/api/public/v1/home/swiperdata"
        // });


        // // 2.获取数据，遍历渲染！
        // this.arrSwiper = data.data.message;

        // ************************************************封装插件后：
        let {message} =  await this.$request({
          url:"/api/public/v1/home/swiperdata"
        });
        this.arrSwiper = message;
      },
      // 导航  
      async get_nav(){

        let {message} =  await this.$request({
          url:"/api/public/v1/home/catitems"
        });
        this.arrNav = message;
      },
      // 楼层数据 
      async get_floor(){

        let {message} =  await this.$request({
          url:"/api/public/v1/home/floordata"
        });
        this.arrFloor = message;
      },
    },


  }
</script>

<style scoped lang="less">
  .banner {
    width: 100%;
    height: 340rpx;

    image {
      width: 100%;
      height: 340rpx;
    }
  }

  .navs {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 44rpx;

    image {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor {

    .title {
      width: 750rpx;
      height: 60rpx;
      padding: 20rpx 0 0 8rpx;
      background-color: #f4f4f4;
    }

    .items {
      padding: 20rpx 16rpx;
      overflow: hidden;

      navigator {
        width: 193rpx;
        height: 188rpx;
        margin-left: 10rpx;
        margin-bottom: 10rpx;
        float: left;
      }

      navigator:first-child {
        width: 232rpx;
        height: 386rpx;
        margin-left: 0rpx;
      }

      navigator:nth-child(2),
      navigator:nth-child(5) {
        width: 273rpx;
      }
    }

    &:first-child {

      .items {

        navigator {
          width: 233rpx;
        }
      }
    }
  }

  .goTop {
    position: fixed;
    bottom: 30rpx;
    /* #ifdef H5 */
    bottom: 65px;
    /* #endif */
    right: 30rpx;
  
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    font-size: 48rpx;
    color: #666;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>