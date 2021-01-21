<template>
  <view>
    <!-- 搜索 -->
    <search />


    <!-- 分类 -->
    <view class="category">

      <!-- 一级分类 active：当前项-->
      <view class="sup">
        <scroll-view scroll-y>

          <text 
            v-for="(item,index) in list" 
            :key="index"
            :class="{'active':index==ac_index}"
            @tap="change(index)">{{item.cat_name}}</text>

        </scroll-view>
      </view>

      
      <view class="sub">
        <scroll-view scroll-y>

          <image src="http://static.botue.com/ugo/uploads/category.png" class="thumb"></image>


          <!-- 二级分类:谁的二级分类？当前active那一项的一级分类 -->
          <!-- 0: 代表就是当前的选中 一级分类下的数据 -->
          <!--    当前的选中是变的！ ac_index-->
          <view class="children" v-for="item in list[ac_index].children" :key="item.cat_id">

            <view class="title">{{item.cat_name}}</view>

            <view class="brands">

              <!-- 三级分类 -->
              <navigator url="/pages/list/index" v-for="one in item.children" :key="one.cat_id">
                <image :src="one.cat_icon"></image>
                <text>{{one.cat_name}}</text>
              </navigator>


            </view>


          </view>

        </scroll-view>
      </view>


    </view>
  </view>
</template>

<script>
  // 1.导入组件
  import search from '@/components/search';

  export default {
    data(){
      return {
        list:[],
        // 默认值：就是初始化哪个一级导航为active状态
        ac_index:0
      }
    },
    // 2.注册
    components: {
      search
    },
    onLoad(){
      this.getData();
    },
    methods:{
      // 获取列表
      async getData(){
        // 1.获取数据
        const {message} = await this.$request({
          url:"/api/public/v1/categories"
        });

        // 2.赋值
        this.list = message;
      },
      // 点击后切换
      change(index){
        // 目标：把当前active类名加到当前点击的这项
        //       点击后，只要把 :class="{'active':index==位置}"  位置上数据变为当前的点击项下标
        //       如何获取当前的点击项下标
        this.ac_index = index;
      }
    }
  }
</script>

<style scoped lang="less">
  scroll-view {
    height: 100%;
  }

  .category {
    display: flex;
    width: 100%;
    position: absolute;
    top: 100rpx;
    bottom: 0;

    .sup {
      width: 196rpx;
      background-color: #f4f4f4;

      text {
        display: block;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        font-size: 27rpx;
        color: #333;
        border-bottom: 1rpx solid #eee;

        &:last-child {
          border-bottom: none;
        }
        
        &.active {
          background-color: #FFF;
          color: #ea4451;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 8rpx;
            height: 60rpx;
            transform: translateY(-50%);
            background-color: #ea4451;

            position: absolute;
            left: 0;
            top: 50%;
          }
        }
      }
    }

    .sub {
      flex: 1;
      padding: 20rpx 18rpx;

      .thumb {
        width: 100%;
        height: 180rpx;
      }

      .children {
        text-align: center;
        color: #333;

        .title {
          display: inline-block;
          margin: 40rpx 0 20rpx;
          font-size: 30rpx;

          &::before {
            content: '/';
            margin-right: 20rpx;
            color: #666;
          }

          &::after {
            content: '/';
            margin-left: 20rpx;
            color: #666;
          }
        }
      }

      .brands {
        display: flex;
        flex-wrap: wrap;

        navigator {
          width: 33%;
          margin-bottom: 20rpx;
        }

        image {
          width: 120rpx;
          height: 120rpx;
        }

        text {
          display: block;
          font-size: 24rpx;
        }
      }
    }
  }
</style>
