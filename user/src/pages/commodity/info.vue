<template>
  <div style="width: 70%; margin: 35px auto">
    <el-row>
      <el-col :span="13">
        <el-carousel height="350" style="width: 450px;">
          <el-carousel-item v-for="item in urlList" :key="item">
            <el-image style="height: 100%; width: 100%" :src="item"></el-image>
          </el-carousel-item>
        </el-carousel>
        <a class="el-icon-star-off"
           style="color: #999;margin-top: 15px; font-size: 15px;cursor: pointer;"
           @click="keepCommodity">收藏商品（{{keep}}）</a>
      </el-col>
      <el-col :span="11">
        <el-row style="height: 50px">
          <span style="font-weight: 700;font-size: 16px">{{name}}</span>
          <span style="font-weight: 700;font-size: 16px; float: right">{{shopName}}</span>
        </el-row>
        <el-row style="height: 120px">
          <el-card class="box-card" style="background:#e9e9e9;">
            <span class="myFont">价格</span>
            <span v-if="cSpecification && cWeight"
                  style="color: #FF0036;
              font-weight: bolder;
              font-size: 30px;
              vertical-align:
              middle;font-family: Arial">￥{{calPrice(num,price)}}</span>
            <span v-else
                  style="color: #FF0036;
              font-weight: bolder;
              font-size: 30px;
              vertical-align:
              middle;font-family: Arial">￥{{min}}起</span>
          </el-card>
        </el-row>
        <el-row>
          <el-row class="myRadio">
            <div>
              <span class="myFont mySpan" style="font-size: 18px">重量/kg</span>
              <el-radio size="mini" v-for="(item, index) in weights"
                        :key="index"
                        v-model="cWeight"
                        :label="item" border
                        :disabled="cSpecification !== '' && !info[cSpecification][item]"
                        @click.native.prevent="clickWeight(item)"
                        ></el-radio>
            </div>
          </el-row>
          <el-row class="myRadio" style="margin-top: 35px">
            <span class="myFont mySpan" style="font-size: 18px">规格</span>
            <el-radio size="mini"
                      v-for="(item, index) in specifications"
                      :key="index"
                      v-model="cSpecification"
                      :label="item" border
                      :disabled="cWeight !== '' && !info[cWeight][item]"
                      @click.native.prevent="clickSpecification(item)"></el-radio>
          </el-row>
          <el-row class="myRadio" style="margin-top: 35px">
            <span class="myFont mySpan" style="font-size: 18px">数量</span>
            <el-input-number style="width: 120px"
                             v-model="num"
                             controls-position="right"
                             :min="1"
                             :max="stock">
            </el-input-number>
            <span v-if="stock" style="color: #878787;
                                      margin-left: 1.2em;
                                      font-size: 10px">库存{{stock}}件</span>
          </el-row>
        </el-row>
        <el-row style="margin-top: 45px; margin-left: 30px">
          <el-button style="margin-right: 0;
                            float: left;
                            overflow: hidden;
                            position: relative;
                            width: 178px;
                            background-color: #ffeded;
                            border: 1px solid #FF0036;
                            color: #FF0036;
                            font-family: 'Microsoft Yahei';"
                     @click="buy">立即购买
          </el-button>
          <el-button style="background-color: #ff0036;
                            border: 1px solid #ff0036;
                            width: 178px;
                            color: #fff;"
                            @click="addCar"><b class="el-icon-shopping-cart-2"></b>加入购物车
          </el-button>
        </el-row>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-card>
        商品评价 ({{number - 1}})
        <el-rate
          style="float: right"
          v-model="score"
          disabled
          show-score
          text-color="#f60">
        </el-rate>
      </el-card>
      <ul>
        <span v-if="cur === 1 && commentList.length === 0" style="width:120px; margin-left: 40%">下一单写个评论吧</span>
        <li v-else style="list-style: none;" v-for="(item,index) in commentList" :key="index">
          <el-row style="overflow:auto;">
            <el-col :span="2">
              <el-avatar style="width: 60px; height: 60px;" :src="item.avatar"></el-avatar>
            </el-col>
            <el-col :span="14">
              <el-row style="height: 20px">
                <span>{{item.nickname}}</span>
                <span style="float: right" v-if="item.score >= 4">好评</span>
                <span style="float: right" v-else-if="item.score >= 2">中评</span>
                <span style="float: right" v-else>差评</span>
              </el-row>
              <el-row style="margin-top: 20px">
                <span>{{item.content}}</span>
                <span style="float: right; font-size: 7px">{{item.createTime}}</span>
              </el-row>
            </el-col>
            <el-col :span="8" style="font-size: 14px; height: 100%;">
              <div style="width: 150px; margin: 0 auto">
                <div><span class="mySpan">规格:</span> {{item.specification}}</div>
                <div><span class="mySpan">重量/kg:</span> {{item.weight}}</div>
                <div><span class="mySpan">数量:</span> {{item.num}}}</div>
              </div>
            </el-col>
          </el-row>
        </li>
      </ul>

      <el-pagination
        style="float: right; margin-top: 15px"
        layout="prev, pager, next"
        :current-page="cur"
        @current-change="initComment"
        :total="total">
      </el-pagination>
    </el-row>


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
  import commodity from "../../api/commodity";
  import {mapGetters} from 'vuex'
  import shopCar from "../../api/shopCar";
  import user from "../../api/user";
  import order from "../../api/order";
  import {accMul} from "../../utils/cal";

  export default {
    name: "info",
    created() {
      this.commodityId = this.$route.query.id
      this.init()
      this.initComment()
    },
    computed: {
      ...mapGetters([
        'id',
      ])
    },
    data() {
      return {
        commodityId: 0,
        radio1: '1',
        num: 1,
        name: '',
        shopName: '',
        shopId: '',
        urlList: [],
        specifications: [],
        weights: [],
        cSpecification: '',
        cWeight: '',
        price: 0.0,
        min: 1000000.0,
        info: [],
        stock: 0,
        infoId: 0,
        score: 0.0,
        number: 0,
        cur: 1,
        commentList: [],
        total: 10,
        keep: 0,
        isKeep: false,
        car: {},
        addressVisible: false,
        addressList: [],
        order: {
          addressId: 0,
          commodityId: 0,
          infoId: 0,
          shopId: 0,
          shopName: '',
          commodityName: '',
          quantity: 0,
        }
      }
    },
    methods: {
      init() {
        commodity.getInfo(this.commodityId).then(response => {
          let voList = response.data.voList;
          for (let i = 0; i < voList.length; i++) {
            let k = voList[i]
            let specification = k.specification
            let weight = k.weight
            if (this.specifications.indexOf(specification) == -1) {
              this.specifications.push(specification)
            }
            if (this.weights.indexOf(weight) == -1) {
              this.weights.push(weight)
            }
            if (this.min > k.price) {
              this.min = k.price
            }
            if (!this.info[specification]) {
              this.info[specification] = {}
            }
            this.info[specification][weight] = {
              id: k.id,
              price: k.price,
              stock: k.stock
            }
            if (!this.info[weight]) {
              this.info[weight] = {}
            }
            this.info[weight][specification] = {
              id: k.id,
              price: k.price,
              stock: k.stock
            }
          }
          this.name = response.data.name
          this.shopName = response.data.shopName
          this.shopId = response.data.shopId
          this.urlList = response.data.urlList
          this.number = response.data.number
          this.score = response.data.score
          this.keep = response.data.keep
          this.isKeep = response.data.isKeep
        })
      },

      initComment(){
        commodity.getComment(this.commodityId,this.cur).then(response => {
          this.commentList = response.data.data
          this.total  = response.data.total
        })
      },

      clickWeight(e){
        if (this.cSpecification) {
          if (this.info[this.cSpecification][e]) {
            if (e === this.cWeight){
              this.cWeight = ''
            } else {
              this.cWeight = e
              this.price = this.info[this.cSpecification][e].price
              this.stock = this.info[this.cSpecification][e].stock
            }
          } else {
            return false
          }
        } else {
          e === this.cWeight ? this.cWeight = '' : this.cWeight = e
        }

      },

      clickSpecification(e){
        if (this.cWeight) {
          if (this.info[this.cWeight][e]) {
            if (e === this.cSpecification){
              this.cSpecification = ''
            } else {
              this.cSpecification = e
              this.price = this.info[this.cWeight][e].price
              this.stock = this.info[this.cWeight][e].stock
            }
          } else {
            return false
          }
        } else {
          e === this.cSpecification ? this.cSpecification = '' : this.cSpecification = e
        }
      },

      calPrice(num, price){
        return accMul(num,price)
      },

      keepCommodity(){
        if (this.isKeep) {
          this.$message({
            type: 'info',
            message: '你已经收藏过了，可以到收藏夹看看哦~~~'
          })
        } else {
          commodity.keep(this.commodityId).then(() => {
            this.isKeep = true
            this.keep += 1
            this.$message({
              type: 'success',
              message: '收藏成功',
            })
          })
        }
      },
      addCar(){
        if (this.id) {
          let infoId = this.info[this.cSpecification][this.cWeight].id
          this.car = {
            userId: this.id,
            shopName: this.shopName,
            shopId: this.shopId,
            commodityId: this.commodityId,
            commodityName: this.name,
            infoId: infoId,
            quantity: this.num,
            url: this.urlList[0]
          }
          shopCar.createCar(this.car).then(()=>{
            this.$message({
              type: 'success',
              message: '添加购物车成功 去购物车下单吧~~~'
            })
          })
        } else {
          this.$router.push('/login?redirect=' + this.$router.currentRoute.fullPath)
        }
      },
      buy() {
        this.order.quantity = this.num
        this.order.commodityId = this.commodityId
        this.order.commodityName = this.name
        this.order.shopId = this.shopId
        this.order.shopName = this.shopName
        this.order.infoId = this.info[this.cSpecification][this.cWeight].id
        user.getAddressList().then(response => {
          this.addressVisible = true
          this.addressList = response.data
        })
      },
      createOrder(){
        // TODO 跳转支付
        order.create(this.order).then(response => {

        })
      }
    },
  }

</script>

<style>
  .myRadio .el-radio__input {
    display: none;
  }

  .myRadio .el-radio {
    margin-right: 0px;
    min-width: 80px;
    text-align: center;
  }

  .myFont {
    color: #999;
    font-size: 12px;
    text-align: left;
  }

  .mySpan {
    display: -moz-inline-box;
    display: inline-block;
    width: 80px;
    text-align: left;
  }
</style>
