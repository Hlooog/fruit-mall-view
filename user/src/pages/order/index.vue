<template>
  <div style="width: 80%; margin: 40px auto">
    <el-card style="background:#f5f5f5; border: 1px solid #e8e8e8; text-align: center">
      <el-row>
        <el-col style="width: 470px">
          <span>宝贝</span>
        </el-col>
        <el-col style="width: 80px">
          <span>单价</span>
        </el-col>
        <el-col style="width: 50px;">
          <span>数量</span>
        </el-col>
        <el-col style="width: 110px">
          <span>实付款</span>
        </el-col>
        <el-col style="width: 80px">
          <span>商品状态</span>
        </el-col>
        <el-col :span="3">
          <span>操作</span>
        </el-col>
      </el-row>
    </el-card>

    <div style="margin-top: 30px" v-for="(order,index) in orderList" :key="index">
      <div style="border: 1px solid #ececec">
        <el-row style="height: 40px; text-align: center; line-height: 40px; background:#f5f5f5;">
          <el-col :span="3">
            <span style="font-weight: 700">{{order.createTime}}</span>
          </el-col>
          <el-col :span="7">
            <span>订单号： {{order.orderId}}</span>
          </el-col>
          <el-col :span="2">
            收货地址:
          </el-col>
          <el-col :span="2">
            {{order.name}}
          </el-col>
          <el-col :span="2">
            {{order.phone}}
          </el-col>
          <el-col :span="8">
            {{order.address}}
          </el-col>
        </el-row>
        <el-row v-for="(info,i) in order.infoList"  :key="i">
          <el-row>
            <el-col style="width: 130px;">
              <div style="height: 100px; width: 100px">
                <el-image :src="info.url" style="height: 80px; width: 80px; margin: 10px 10px" fit="contain"></el-image>
              </div>
            </el-col>
            <el-col style="width: 200px">
            <span style="line-height: 70px;">
              {{info.commodityName}}
            </span>
            </el-col>
            <el-col style="width: 190px">
              <div style="width: 95%;
                          white-space:normal;
                          word-break:break-all;
                          word-warp:break-word;
                          margin-top: 20px">
                规格：{{info.specification}}<br/>
                重量: {{info.weight}}
              </div>
            </el-col>
            <el-col style="width: 60px">
              <div style="margin-top: 20px">{{info.price}}</div>
            </el-col>
            <el-col style="width: 80px">
              <div style="margin-top: 20px">{{info.quantity}}</div>
            </el-col>
            <el-col style="width: 80px">
              <div style="margin-top: 20px">{{calPrice(info.quantity,info.price)}}</div>
            </el-col>
            <el-col style="width: 80px">
              <div style="margin-top: 20px">
                {{info.statusStr}}
              </div>
            </el-col>
            <el-col style="width: 170px">
              <el-button type="text" v-if="info.status === 0" style="margin-top: 15px">去支付</el-button>
              <el-button type="text" v-if="info.status === 1" style="margin-top: 15px">申请退款</el-button>
              <el-button type="text" v-if="info.status === 2" style="margin-top: 15px">申请退款</el-button>
              <el-button type="text" v-if="info.status === 0" style="margin-top: 15px">取消订单</el-button>
            </el-col>
          </el-row>
          <el-row>
            <div style="margin-left: 12%" v-if="info.trackNumber">快递单号: {{info.trackNumber}}</div>
          </el-row>
        </el-row>
      </div>
    </div>

    <el-pagination
      style="margin: 20px 40%"
      :current-page="cur"
      @current-change="init"
      layout="prev, pager, next"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import {accMul} from "../../utils/cal";
  import order from "../../api/order";

  export default {
    name: "index",
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (!vm.$store.getters.id) {
          vm.$router.push('/login?redirect=' + vm.$router.currentRoute.fullPath)
        }
      })
    },
    created() {
      this.init()
    },
    data() {
      return {
        orderList: [],
        cur: 1,
        total: 10
      }
    },
    methods: {
      init(){
        order.userPage(this.cur).then(response => {
          this.orderList = response.data.data
          this.total = response.data.total
        })
      },

      calPrice(quantity,price) {
        return accMul(quantity,price)
      },
    },
  }
</script>

<style scoped>

</style>
