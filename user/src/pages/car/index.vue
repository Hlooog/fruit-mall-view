<template>
  <div style="width: 70%; margin: 40px auto">
    <span style="font-style: normal; color: #f40; font-size: 25px; font-weight: bold">购物车</span>
    <el-divider></el-divider>
    <el-row style="width: 890px">
      <el-col :span="12" style="text-align: center">
        <span style="font-weight: lighter">商品信息</span>
      </el-col>
      <el-col :span="3" style="text-align: center">
        <span style="font-weight: lighter">单价</span>
      </el-col>
      <el-col :span="4" style="text-align: center">
        <span style="font-weight: lighter">数量</span>
      </el-col>
      <el-col :span="2" style="text-align: center">
        <span style="font-weight: lighter">金额</span>
      </el-col>
      <el-col :span="3" style="text-align: center">
        <span style="font-weight: lighter">操作</span>
      </el-col>
    </el-row>
    <div v-for="(item,index) in list" :key="index">
      <el-checkbox style="height: 35px; margin-top: 15px"
                   v-model="shopCheck[index]"
                   @change="checkShop(index)"> 店铺：
        {{item[0].shopName}}
      </el-checkbox>
      <el-card class="box-card" style="width: 100%">
        <div v-for="(i,t) in item" :key="t">
          <el-row>
            <el-col :span="1">
              <el-checkbox style="width: 950px" v-model="checked[i.id]"
                           @change="check(index,i.id,i.price,i.quantity)"></el-checkbox>
            </el-col>
            <el-col :span="23">
              <el-row style="width: 890px">
                <el-col :span="3">
                  <el-image :src="i.url" style="height: 60px; width: 60px"></el-image>
                </el-col>
                <el-col :span="4">
                  {{i.commodityName}}
                </el-col>
                <el-col :span="4">
                  <div style="width: 95%;
                          white-space:normal;
                          word-break:break-all;
                          word-warp:break-word;">
                    规格：{{i.specification}}<br/>
                    重量: {{i.weight}}
                  </div>
                </el-col>
                <el-col :span="3">
                  <span style="font-weight: bold">￥{{i.price}}</span>
                </el-col>
                <el-col :span="4">
                  <el-input-number size="mini"
                                   v-model="i.quantity"
                                   :min="1"
                                   :max="5"
                                   @change="(cur,old) => numChange(cur, old, i.price,i.id)"></el-input-number>
                </el-col>
                <el-col :span="3">
                  <span style="font-weight: bold">￥{{numFilter(i.price, i. quantity)}}</span>
                </el-col>
                <el-col :span="3">
                  <el-button type="text" @click="moveOut(index,i.id,i.price,i.quantity)">移出购物车</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-divider></el-divider>
        </div>
      </el-card>
    </div>
    <el-card style="margin-top: 30px;background: #e5e5e5;">
      <el-row></el-row>
      <el-checkbox v-model="isAll" @change="allCheck">全选</el-checkbox>
      <span style="margin-left: 60%">已选商品<span style="color: #f40">{{num}}</span>件</span>
      <span style="margin-left: 5%">合计<span style="color: #f40">{{price}}</span></span>
      <el-button v-if="num > 0"
                 style="background:#f40;
                 color: white;
                 font-weight: lighter;
                 float: right;
                 margin-top: -10px"
                 @click="buy">结算
      </el-button>
      <el-button v-else style="background:#3c3c3c;
        color: white;
        font-weight: lighter;
        float: right;
        margin-top: -10px"
                 disabled>结算
      </el-button>
    </el-card>

    <el-dialog
      title="选择地址"
      :visible.sync="addressVisible"
      width="50%">
      <div  v-for="(item,index) in addressList" :key="index" style="height: 70px">
        <el-radio style="width: 500px"
                  :label="item.id" v-model="order.addressId"
                  border>
        <span>
            <span>{{item.name}}</span>
            <span>{{item.phone}}</span>
            <span style="float:right;">{{item.address}}</span>
        </span>
        </el-radio>
      </div>
      <div>
        <el-button style="margin-left: 80%;
          background:rgb(255, 0, 54);
          color: white"
          @click="createOrder">提交订单</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import shopCar from "../../api/shopCar";
  import {accAdd, accDiv, accMul, subtr} from "../../utils/cal";
  import user from "../../api/user";
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
        list: {},
        checked: {},
        isAll: false,
        shopCheck: {},
        checkNum: 0,
        shopNum: {},
        shopCheckNum: {},
        checkId: {},
        num: 0,
        price: 0.0,
        addressVisible: false,
        order: {
          carIds: [],
          addressId: 0,
        },
        addressList: []
      }
    },
    methods: {

      init() {
        shopCar.list().then(response => {
          let data = response.data
          this.list = data
          for (let key in data) {
            this.$set(this.shopCheck, key, false)
            if (!this.checkId[key]) {
              this.checkId[key] = []
            }
            for (let i = 0; i < data[key].length; i++) {
              if (!this.shopNum[key]) {
                this.shopNum[key] = 0
              }
              this.shopNum[key] += 1
              this.checkId[key].push(data[key][i].id)
              // this.checked[data[key][i].id] = false
              this.$set(this.checked, data[key][i].id, false)
              this.checkNum += 1
            }
          }
        })
      },

      allCheck(val) {
        if (val) {
          for (let key in this.checkId) {
            this.shopCheck[key] = true
            this.shopCheckNum[key] = this.checkId[key].length
            for (let i = 0; i < this.checkId[key].length; i++) {
              let mul = accMul(this.list[key][i].price, this.list[key][i].quantity)
              this.price = accAdd(this.price, mul)
              this.num += 1
              this.checked[this.checkId[key][i]] = true
            }
          }
        } else {
          for (let key in this.checkId) {
            this.shopCheck[key] = false
            this.shopCheckNum[key] = 0
            for (let i = 0; i < this.checkId[key].length; i++) {
              this.price = 0
              this.num -= 1
              this.checked[this.checkId[key][i]] = false
            }
          }
        }
      },

      checkShop(index) {
        if (this.shopCheck[index]) {
          this.shopCheckNum[index] = this.checkId[index].length
          for (let i = 0; i < this.checkId[index].length; i++) {
            let mul = accMul(this.list[index][i].price, this.list[index][i].quantity)
            this.price = accAdd(this.price, mul)
            this.num += 1
            this.checked[this.checkId[index][i]] = true
          }
        } else {
          this.shopCheckNum[index] = 0
          for (let i = 0; i < this.checkId[index].length; i++) {
            let mul = accMul(this.list[index][i].price, this.list[index][i].quantity)
            this.price = subtr(this.price, mul)
            this.num -= 1
            this.checked[this.checkId[index][i]] = false
          }
        }
        if (this.num == this.checkNum) {
          this.isAll = true
        } else {
          this.isAll = false
        }
      },

      check(index, id, price, quantity) {
        if (this.checked[id]) {
          this.num += 1
          if (!this.shopCheckNum[index]) {
            this.shopCheckNum[index] = 0
          }
          this.shopCheckNum[index] += 1
          let mul = accMul(price, quantity)
          this.price = accAdd(this.price, mul)
        } else {
          this.num -= 1
          this.shopCheckNum[index] -= 1
          let mul = accMul(price, quantity)
          this.price = subtr(this.price, mul)
        }
        if (this.num == this.checkNum) {
          this.isAll = true
        } else {
          this.isAll = false
        }

        if (this.shopCheckNum[index] == this.shopNum[index]) {
          this.shopCheck[index] = true
        } else {
          this.shopCheck[index] = false
        }
      },

      numChange(curValue, oldValue, price, id) {
        if (curValue > oldValue) {
          if (this.checked[id]) {
            this.price = accAdd(this.price, accMul(curValue - oldValue, price))
          }
          shopCar.increase(id)
        } else {
          if (this.checked[id]) {
            this.price = subtr(this.price, accMul(oldValue - curValue, price))
          }
          shopCar.decrease(id)
        }
      },

      numFilter(quantity, price) {
        return accMul(quantity, price)
      },

      moveOut(index, id, price, quantity) {
        if (this.checked[id]) {
          this.price = subtr(this.price, accMul(price, quantity))
        }
        delete this.checked[id]
        if (this.list[index].length === 1) {
          this.list[index] = []
          delete this.list[index]
          console.log(this.list)
        } else {
          let j = 0
          for (let i = 0; i < this.list[index].length; i++) {
            if (this.list[index][i].id === id) {
              j = i
              break
            }
          }
          this.list[index].splice(j, 1)
        }
        shopCar.moveOut(id)
      },

      buy() {
        this.order.carIds = []
        for (let key in this.checked) {
          if (this.checked[key]) {
            this.order.carIds.push(key)
          }
        }
        user.getAddressList().then(response => {
          this.addressVisible = true
          this.addressList = response.data
        })
      },

      createOrder(){
        order.createCar(this.order).then(response=>{
          // TODO 跳转支付页面
        })
      }
    },
  }
</script>

<style scoped>
</style>
