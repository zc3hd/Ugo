<template>
  <view>
    <!-- 筛选 -->
    <view class="filter">
      <text class="active">综合</text>
      <text>销量</text>
      <text>价格</text>
    </view>


    <!-- 商品列表 -->
    <scroll-view class="goods" scroll-y @scrolltolower="scrolltolower">


      <view class="item" @click="goDetail" v-for="item in list" :key="item.goods_id">
        <!-- 商品图片 -->
        <image class="pic" :src="item.goods_small_logo"></image>
        <!-- 商品信息 -->
        <view class="meta">
          <view class="name">{{item.goods_name}}</view>
          <view class="price">
            <text>￥</text>{{item.goods_price}}<text>.00</text>
          </view>
        </view>
      </view>




    </scroll-view>


  </view>
</template>

<script>
  export default {
    data(){
      return {
        query:"",
        pagenum:1,
        pagesize:5,
        // 接受返回列表数据
        list:[],
        // 初始化：表示请求没有完成！
        flag:false,
      }
    },
    onLoad(e){
      // 1.加载后获取路径上参数！
      this.query = e.query;

      // 2.初始化数据展示 发出请求，获取数据
      this.getList();
    },
    methods: {
      goDetail () {
        uni.navigateTo({
          url: '/pages/goods/index'
        })
      },
      // 发出请求的过程
      async getList(){
        // 表示请求没有完成！
        this.flag = false;

        // 1.请求
        const {message} =  await this.$request({
          url:"/api/public/v1/goods/search",
          data:{
            query:this.query,
            pagenum:this.pagenum,
            pagesize:this.pagesize,
          }
        });

        // 请求已经完成！
         this.flag = true;

        // 2.获取数据，拿到是一个数组；下一次拿到还是个数组；
        // 上一次的数组和下一次的数组 拼接在一起  concat
        this.list = this.list.concat(message.goods);
      },
      // 触底的执行函数
      scrolltolower(){
        // 代表上一次请求已经完成了！
        if (this.flag) {
          // 1.加载下一页
          this.pagenum++;

          // 2.重新发出一次请求
          this.getList();
        }

      }
    },
  }
</script>

<style scoped lang="less">
  .filter {
    display: flex;
    height: 96rpx;
    line-height: 96rpx;
    border-bottom: 1rpx solid #ddd;

    /* #ifdef H5 */
    position: relative;
    z-index: 99;
    /* #endif */

    text {
      flex: 1;
      text-align: center;
      font-size: 30rpx;
      color: #333;

      &.active {
        color: #ea4451;
      }
    }
  }
  
  .goods {
    position: absolute;
    width: 100%;
    top: 97rpx;
    bottom: 0;
  }

  .item {
    display: flex;
    padding: 30rpx 20rpx 30rpx 0;
    margin-left: 20rpx;
    border-bottom: 1rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }

    .pic {
      width: 200rpx;
      height: 200rpx;
      margin-right: 30rpx;
    }

    .meta {
      flex: 1;
      font-size: 27rpx;
      color: #333;
      position: relative;
    }

    .name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .price {
      position: absolute;
      bottom: 0;

      color: #ea4451;
      font-size: 33rpx;

      text {
        font-size: 22rpx;
      }
    }
  }
</style>
