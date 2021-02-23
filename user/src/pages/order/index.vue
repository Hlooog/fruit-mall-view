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
        <el-row v-for="(info,i) in order.infoList" :key="i">
          <el-row>
            <el-col style="width: 130px;">
              <div style="height: 100px; width: 100px">
                <el-image :src="info.url" style="height: 80px; width: 80px; margin: 10px 10px" fit="contain"></el-image>
              </div>
            </el-col>
            <el-col style="width: 200px">
              <div style="line-height: 70px;">
                <a @click="toInfo(info.commodityId)" style="cursor: pointer;">
                {{info.commodityName}}
                </a>
              </div>
              <div>
                {{info.shopName}}
              </div>
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
            <el-col style="width: 180px">
              <el-button type="text" v-if="info.status === 0"
                         style="margin-top: 15px" @click="toPay(order.orderId)">
                去支付
              </el-button>
              <el-button type="text"
                         v-if="info.status === 0"
                         style="margin-top: 15px" @click="cancel(order.orderId,index,i)">取消订单
              </el-button>
              <el-button type="text" v-if="info.status === 1 || info.status === 2"
                         style="margin-top: 15px" @click="applyRefund(info.id,index,i)">申请退款
              </el-button>
              <el-button type="text" v-if="info.status === 2"
                         style="margin-top: 15px" @click="confirm(info.id,index,i)">确认收货
              </el-button>
              <el-button type="text" v-if="info.status === 3"
                         style="margin-top: 15px" @click="addComment(info.id,index,i)">评论商品</el-button>
              <div v-if="info.status === 0" style="font-size: 8px; ">{{data[order.orderId].time}}秒后订单被取消</div>
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
      :current-page.sync="cur"
      @current-change="init"
      layout="prev, pager, next"
      :total="total">
    </el-pagination>

    <el-dialog title="添加评论" :visible.sync="visible">
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请发表你的意见"
        v-model="comment.content"
        maxlength='255'>
      </el-input>
      <el-rate
        allow-half
        style="margin: 15px 20px"
        v-model="comment.score"
        :texts="level"
        show-text>
      </el-rate>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import {accMul} from "../../utils/cal";
  import order from "../../api/order";
  import {mapGetters} from 'vuex'

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
    computed: {
      ...mapGetters([
        'data',
      ])
    },
    data() {
      return {
        orderList: [],
        cur: 1,
        total: 10,
        visible: false,
        comment: {
          id: 0,
          content: '',
          score: 0.0,
        },
        level: [
          '差评',
          '中评',
          '中评',
          '好评',
          '好评',
        ],
        index: 0,
        i: 0,
      }
    },
    methods: {
      init() {
        this.orderList = []
        order.userPage(this.cur).then(response => {
          // this.orderList = response.data.data
          this.total = response.data.total
          for (let i = 0; i < response.data.data.length; i++) {
            this.$set(this.orderList,i,response.data.data[i])
          }
        })
      },

      calPrice(quantity, price) {
        return accMul(quantity, price)
      },

      toPay(orderId) {
        this.$router.push({path: '/pay/index', query: {orderId: orderId}})
      },

      applyRefund(id, index, i) {
        order.applyRefund(id).then(() => {
          this.orderList[index].infoList[i].status = 4
          this.orderList[index].infoList[i].statusStr = '退款中'
        })
      },
      cancel(orderId, index,i) {
        order.cancel(orderId).then(() => {
          this.orderList[index].infoList[i].status = 6
          this.orderList[index].infoList[i].statusStr = '取消订单'
          this.$store.dispatch('order/delOrder', orderId)
        })
      },
      confirm(id, index,i){
        order.confirm(id).then(() => {
          this.orderList[index].infoList[i].status = 3
          this.orderList[index].infoList[i].statusStr = '交易完成'
        })
      },
      addComment(id, index,i) {
        this.comment.id = id
        this.visible = true
        this.index = index
        this.i = i
      },
      submit(){
        order.addComment(this.comment).then(() => {
          this.orderList[this.index].infoList[this.i].status = 7
          this.orderList[this.index].infoList[this.i].statusStr = '已评论'
          this.visible = false
        })
      },
      toInfo(id) {
        this.$router.push({path: '/commodity/info', query: {id: id}})
      },
    },
  }
</script>

<style scoped>

</style>
