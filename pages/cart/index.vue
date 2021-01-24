<template>
  <view class="wrapper">
    <!-- 收货信息 -->
    <view class="shipment">


      <button type="primary" @tap="getAddr" v-if="addr==null">获取收货地址</button>


      <block v-else>
        <view class="dt">收货人: </view>
        <view class="dd meta">
          <text class="name">{{addr.userName}}</text>
          <text class="phone">{{addr.telNumber}}</text>
        </view>
        <view class="dt">收货地址:</view>
        <view class="dd">{{addr.detailAddr}}</view>
      </block>


    </view>

    <!-- 购物车 -->
    <view class="carts">
      <view class="item">
        <!-- 店铺名称 -->
        <view class="shopname">优购生活馆</view>


        <view class="goods" v-for="(item,index) in list" :key="item.goods_id">
          <!-- 商品图片 -->
          <image class="pic" :src="item.goods_small_logo"></image>
          <!-- 商品信息 -->
          <view class="meta">
            <view class="name">{{item.goods_name}}</view>
            <view class="price">
              <text>￥</text>{{item.goods_price}}<text>.00</text>
            </view>
            <!-- 加减 -->
            <view class="amount">
              <text class="reduce" @tap="changeNumb(-1,index)">-</text>
              <input type="number" :value="item.goods_number" class="number">
              <text class="plus" @tap="changeNumb(+1,index)">+</text>
            </view>
          </view>
          <!-- 选框 -->
          <view class="checkbox">
            <!-- 发现：购买状态和每一个商品绑定在一起的！需要一个属性名值描述购买状态！ -->
            <!--      需要增加一个属性值，怎么增加？把商品添加到购物车！从那个地方补充这个属性！ -->
            <icon type="success" size="20" :color="item.goods_buy?'#ea4451':'#ccc'" @tap="changeBuy(index)"></icon>
          </view>
        </view>




      </view>
    </view>



    <!-- 其它 -->
    <view class="extra">
      <label class="checkall">
        <icon type="success" 
          :color="is?'#ea4451':'#ccc'" size="20"
          @tap="changeAll"></icon>
        全选
      </label>
      <view class="total">
        合计: <text>￥</text><label>{{sum}}</label><text>.00</text>
      </view>
      <view class="pay" @tap="addOrder">结算({{ck_list.length}})</view>
    </view>
  </view>
</template>

<script>
  export default {
    data(){
      return {
        list:[],
        addr:null,
      }
    },
    computed:{
      ck_list:function () { 
        let arr = [];

        // 循环遍历，把选中商品筛选出来；
        this.list.forEach(function (item,index) { 
          if (item.goods_buy) {
            arr.push(item);
          }
        })

        return arr;
      },
      // 因为上面三元表达式，第一表达式在uni-app只能写变量，
      // 需要把比较表达式单独设置在一个计算属性上;
      is:function () { 
        return this.ck_list.length==this.list.length;
      },
      // 总价
      sum:function () {
        let numb = 0;

        this.ck_list.forEach(function (item,index) {  
          numb += item.goods_number * item.goods_price;
        });

        return numb;
      }
    },
    // 注意：
    // 1.cart页面路径打开后：执行onLoad();  onShow();
    // 2.从这个cart路径去到其他路径,cart页面其实是隐藏了！不是消失了！
    // 3.从其他路径页面再次回到cart路径，onLoad将不会执行！但是onShow()执行的！
    // onLoad(){
    //   this.list = uni.getStorageSync("list");
    // },
    onShow(){
      this.list = uni.getStorageSync("list");
    },
    methods:{
      // 改变数量
      changeNumb(step,index){
        // 判断当点击是-，且商品数量已经为1；
        if (step==-1&&this.list[index].goods_number==1) {
          return;
        }

        // 数量发生改变
        this.list[index].goods_number = this.list[index].goods_number + step;

        // 数组中数据发生改变，和本地进行同步
        uni.setStorageSync("list",this.list);
      },
      // 改变状态
      changeBuy(index){
        // 1.index:当前商品在数组中下标
        // 2.找到对应商品的；把原来的状态进行对立面的改变
        this.list[index].goods_buy = !this.list[index].goods_buy;


        // 3.数据状态发生改变后，记得要存回本地！
        uni.setStorageSync("list",this.list);
      },
      // 全选改变：
      changeAll(){
        // 1.获取全选的状态
        let key = this.is;

        // 2.取反
        key = !key;

        // 3.把key的值赋值给每一个商品
        this.list.forEach(function (item,index) { 
          item.goods_buy = key;
        });

        // 4.储存回本地
        uni.setStorageSync("list",this.list);

      },
      // 获取地址
      async getAddr(){
        // API获取地址数据
        let [err,res] = await uni.chooseAddress();
        
        // 拼接详细的地址
        res.detailAddr = res.provinceName + res.cityName + res.countyName + res.detailInfo;

        // 赋值初始化数据
        this.addr = res;
      },
      // 结算添加订单
      async addOrder(){
        // 业务：不管用什么框架，都是这样的业务！这个是以后做支付正式前面的流程；
        // 验证：
        //   验证不通过，给相应提醒！
        //    1.收货地址
        if (this.addr==null) {
          uni.showToast({title:"无收货地址!",icon:"none"});
          return;
        }

        //    2.购买商品
        if (this.ck_list.length==0) {
          uni.showToast({title:"无购物的商品!",icon:"none"});
          return;
        }


        //    3.必须有当前使用小程序这个用户登录状态  获取本地token;
        if (!uni.getStorageSync("token")) {
          uni.showToast({title:"当前用户没有登录!",icon:"none"});
          // 接下来小程序得控制用户去专门页面登录！
          uni.navigateTo({
            url:"/pages/auth/index"
          });

          return;
        }




        //   验证通过，就可以写异步请求、创建订单；
        const {message} =  await this.$request({
          url:"/api/public/v1/my/orders/create",
          method:"POST",
          header:{
            Authorization:uni.getStorageSync("token"),  // 用户登录信息
          },
          data:{
            // 订单总价
            order_price:this.sum,
            // 收货地址
            consignee_addr:this.addr.detailAddr,
            // 要购买的商品
            goods:this.ck_list
          }
        });

         // 专门去展示所有订单一个页面
        if (message) {
          uni.navigateTo({
            url:"/pages/order/index"
          });
        }

      }
    }
  }
</script>

<style scoped lang="less">
  .shipment {
    height: 100rpx;
    line-height: 2;
    padding: 30rpx 30rpx 40rpx 30rpx;
    font-size: 27rpx;
    color: #333;
    background-color: #fff;
    background-image: url(http://static.botue.com/ugo/images/cart_border%402x.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;

    .dt {
      width: 140rpx;
      float: left;
      clear: both;
    }

    .dd {
      padding-left: 160rpx;
    }

    .meta {
      padding-right: 50rpx;
    }

    text.phone {
      float: right;
    }
  }

  .carts {
    background-color: #f4f4f4;
    padding-bottom: 110rpx;
    overflow: hidden;

    .shopname {
      padding: 30rpx;
      margin-top: 20rpx;
      font-size: 30rpx;
      color: #333;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
    }

    .goods {
      display: flex;
      padding: 30rpx 20rpx 30rpx 0;
      margin-left: 100rpx;
      border-bottom: 1rpx solid #eee;
      background-color: #fff;
  
      position: relative;

      .checkbox {
        width: 101rpx;
        height: 100%;
        background-color: #fff;

        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        left: -100rpx;
        top: 0;
      }

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

      .amount {
        position: absolute;
        bottom: 0;
        right: 20rpx;

        height: 48rpx;
        text-align: center;
        border: 1rpx solid #ddd;
        border-radius: 8rpx;

        display: flex;
        align-items: center;

        text {
          display: block;
          width: 60rpx;
          line-height: 48rpx;
          font-size: 36rpx;
          color: #ddd;
          text-align: center;
        }

        input {
          width: 60rpx;
          height: 48rpx;
          min-height: 48rpx;
          font-size: 27rpx;
          border-left: 1rpx solid #ddd;
          border-right: 1rpx solid #ddd;
        }
      }
    }
  }

  .extra {
    position: fixed;
    bottom: 0;
    /* #ifdef H5 */
    bottom: 50px;
    /* #endif */
    left: 0;
    z-index: 9;

    width: 750rpx;
    height: 96rpx;
    text-align: center;
    line-height: 96rpx;
    font-size: 36rpx;
    border-top: 1rpx solid #eee;
    background-color: #fff;
    color: #333;
    display: flex;

    .checkall {
      width: 140rpx;
      line-height: 1;
      margin-left: 25rpx;
      display: flex;
      align-items: center;

      icon {
        margin-right: 20rpx;
      }
    }

    .total {
      display: flex;
      justify-content: center;
      flex: 1;

      label, text {
        color: #ea4451;
        vertical-align: bottom;
        position: relative;
        bottom: -2rpx;
      }

      text {
        position: relative;
        bottom: -3rpx;
        font-size: 24rpx;

        &:first-child {
          margin-left: 10rpx;
        }
      }
    }

    .pay {
      width: 200rpx;
      background-color: #ea4451;
      color: #fff;
    }
  }
</style>

