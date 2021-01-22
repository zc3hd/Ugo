<template>
  <view class="wrapper">
    <!-- 商品图片 -->
    <swiper class="pics" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <swiper-item v-for="item in data.pics" :key="item.pics_id">
        <image :src="item.pics_big"></image>
      </swiper-item>
    </swiper>



    <!-- 基本信息 -->
    <view class="meta">
      <view class="price">￥{{data.goods_price}}</view>
      <view class="name">{{data.goods_name}}</view>
      <view class="shipment">快递: 免运费</view>
      <text class="collect icon-star">收藏</text>
    </view>
    <!-- 商品详情 -->
    <view class="detail">
      <rich-text :nodes="data.goods_introduce"></rich-text>
    </view>

    <!-- 操作 -->
    <view class="action">
      <button open-type="contact" class="icon-handset">联系客服</button>
      <text class="cart icon-cart" @tap="goCart">购物车</text>
      <text class="add" @tap="addCart">加入购物车</text>
      <text class="buy" @tap="createOrder">立即购买</text>
    </view>
  </view>
</template>

<script>
  export default {
    data(){
      return {
        id:"",
        data:null,
      }
    },
    onLoad(e){
      // 1.获取id
      this.id = e.id;

      // 2.请求数据
      this.getData();
    },
    methods: {
      // 去购物车那个界面
      goCart () {
        uni.switchTab({
          url: '/pages/cart/index'
        });
      },
      createOrder () {
        uni.navigateTo({
          url: '/pages/order/index'
        })
      },
      async getData(){
        // 1.请求
        const {message} = await this.$request({
          url:"/api/public/v1/goods/detail",
          data:{
            goods_id:this.id
          }
        });

        // 2.接受数据，进行渲染
        this.data = message;
      },
      // 加入购物车
      addCart(){
        // 1.获取本地购物车数据
        let arr = uni.getStorageSync("list") || [];


        // 2.准备商品信息 id name 价格 数量 图片
        let one = {
          goods_id:this.data.goods_id,
          goods_name:this.data.goods_name,
          goods_price:this.data.goods_price,
          goods_small_logo:this.data.goods_small_logo,
          goods_number:1
        };

        // 3.判断 one是否重复；
        //   3.1 假设没有重复
        let flag=false;

        //   3.2 验证到底有么有重复
        // 循环：看是否有重复，如果有重复，立马终止循环，数量加1；
        for (let i = 0; i < arr.length; i++) {
          // 有重复商品；
          if (arr[i].goods_id==one.goods_id) {
            arr[i].goods_number++;
            flag=true;
            break;
          }

        }


        //  3.3 看flag值
        if (flag==false) {
          // 证明上面循环没有一个商品和one是重复
          // one是新商品
          arr.push(one);
        }

        // 4.把改变后数组重新保存回本地
        uni.setStorageSync("list",arr);
      }
    }
  }
</script>

<style scoped lang="less">
  .wrapper {
    margin-bottom: 100rpx;
    background-color: #f4f4f4;
  }

  .pics {
    height: 640rpx;
  }
  
  .meta {
    height: 250rpx;
    line-height: 1;
    padding: 30rpx 180rpx 30rpx 20rpx;
    box-sizing: border-box;
    background-color: #fff;
    position: relative;

    .price {
      font-size: 36rpx;
      color: #ea4451;
      margin-bottom: 20rpx;
    }

    .name {
      color: #333;
      line-height: 1.4;
      font-size: 33rpx;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }

    .shipment {
      font-size: 27rpx;
      color: #999;
      position: absolute;
      bottom: 30rpx;
    }

    .collect {
      width: 140rpx;
      height: 88rpx;
      text-align: center;
      box-sizing: border-box;
      border-left: 1rpx solid #ddd;
      font-size: 24rpx;
      color: #999;

      position: absolute;
      right: 10rpx;
      top: 91rpx;
    }

    [class*="icon-"]::before {
      display: block;
      font-size: 45rpx;
      margin-bottom: 10rpx;
    }
  }

  .detail image {
    width: 100%;
    height: 480rpx;
    margin-top: 20rpx;
  }

  .action {
    width: 100%;
    height: 98rpx;
    background-color: #fff;

    position: fixed;
    left: 0;
    bottom: 0;

    display: flex;
    align-items: center;

    text {
      display: block;
    }

    .add, .buy {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 210rpx;
      text-align: center;
      font-size: 27rpx;
      color: #fff;
    }

    .add {
      background-color: #f4b73f;
    }

    .buy {
      background-color: #ea4451;
    }

    button {
      padding: 0;
      border-radius: 0;
      background-color: #fff;

      &::after {
        border: none;
      }
    }

    button, .cart {
      flex: 1;
      text-align: center;
      color: #989898;
      font-size: 24rpx;
      box-sizing: border-box;
    }

    [class*="icon"]::before {
      display: block;
      font-size: 45rpx;
      margin-bottom: 2rpx;
    }
  }
</style>
