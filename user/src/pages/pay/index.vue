<template>
  <div>
    <el-card style="width: 80%; margin: 30px auto">
      <el-row>
        <el-col :span="8">
          订单号：{{order.orderId}}
        </el-col>
        <el-col :span="13">
          收获地址: {{order.name}} &nbsp;&nbsp; {{order.phone}}  &nbsp;&nbsp; {{order.address}}
        </el-col>
        <el-col :span="3">
          支付金额： <span style="color: #F40; font-weight: bold">{{data[orderId].price}}</span>
        </el-col>
      </el-row>

      <div style="margin-top: 20px" v-for="(item,index) in order.infoList" :key="index">
        <el-row>
          <el-col :span="2">
            <el-image style="width: 70px; height: 70px" :src="item.url"></el-image>
          </el-col>
          <el-col :span="5">
            <div style="height: 50px">{{item.commodityName}}</div>
            <div>店铺名: {{item.shopName}}</div>
          </el-col>
          <el-col :span="5">
            <div style="width: 95%;
                          white-space:normal;
                          word-break:break-all;
                          word-warp:break-word;">
              <div>规格：{{item.specification}}</div>
              <div style="margin-top: 8px">重量: {{item.weight}}</div>
            </div>
          </el-col>
          <el-col :span="2" style="line-height: 80px">
            数量： {{item.quantity}}
          </el-col>
          <el-col :span="3" style="line-height: 80px">
            单价： {{item.price}}
          </el-col>
          <el-col :span="2" style="line-height: 80px">
            总价： {{calPrice(item.price,item.quantity)}}
          </el-col>
        </el-row>
      </div>
      <div style="width: 100%;align-content: center">
        <h1 style="color: #F40; width: 250px; margin: 80px auto">请使用微信扫码支付</h1>
        <h2 style="color: red; font-weight: lighter; margin-left: 40%">{{data[orderId].time}}秒后订单被取消</h2>
        <qriously :value="data[orderId].codeUrl" style="margin-left: 33%" :size="338"></qriously>
      </div>
    </el-card>
  </div>
</template>

<script>
  import order from "../../api/order";
  import {accAdd, accMul} from "../../utils/cal";
  import {mapGetters} from 'vuex'

  export default {
    name: "index",
    created() {
      this.orderId = this.$route.query.orderId
      this.init()
      this.queryOrder()
    },
    data(){
      return {
        orderId: '',
        order: {},
      }
    },
    computed:  {
      ...mapGetters([
        'data'
      ]),
    },
    methods: {
      init(){
        order.getOrder(this.orderId).then(response => {
          this.order = response.data
        })
      },
      calPrice(price,quantity) {
        return accMul(price, quantity)
      },

      queryOrder(){
        setTimeout(() => {
          order.queryOrder(this.orderId).then(response => {
            if (response.data === 'PAYED') {
              this.$router.push('/order/index')
            } else {
              this.queryOrder()
            }
          })
        },10000)
      },
    },
  }
</script>

<style scoped>

</style>
