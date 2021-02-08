<template>
  <div style="width: 70%; margin: 35px auto">
    <el-row>
      <el-col :span="13">
        <el-carousel height="350" style="width: 450px;">
          <el-carousel-item v-for="item in urlList" :key="item">
            <el-image style="height: 100%; width: 100%" :src="item"></el-image>
          </el-carousel-item>
        </el-carousel>
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
              middle;font-family: Arial">￥{{price}}</span>
            <span v-else
                  style="color: #FF0036;
              font-weight: bolder;
              font-size: 30px;
              vertical-align:
              middle;font-family: Arial">￥{{price}}起</span>
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
                            color: #fff;"><b class="el-icon-shopping-cart-2"></b>加入购物车
          </el-button>
        </el-row>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row>
      <el-card>
        商品评价
      </el-card>
      <ul>
        <li style="list-style: none; overflow: auto">
          <el-row style="overflow:auto;">
            <el-col :span="2">
              <el-avatar style="width: 60px; height: 60px;"></el-avatar>
            </el-col>
            <el-col :span="14">
              <el-row style="height: 20px">
                用户名
              </el-row>
              <el-row style="margin-top: 20px">
                <span>这是买过的最好的水果,这是买过的最好的水果,这是买过的最好的水果,这是买过的最好的水果,这是买过的最好的水果,这是买过的最好的水果这是买过的最好的水果,这是买过的最好的水果,这是买过的最好的水果这是买过的最好的水果,这是买过的最好的水果</span>
                <span style="float: right; font-size: 7px">2020-02-08 12:30:30</span>
              </el-row>
            </el-col>
            <el-col :span="8" style="font-size: 14px; height: 100%;">
              <div style="width: 150px; margin: 0 auto">
                <div><span class="mySpan">规格:</span> 大果</div>
                <div><span class="mySpan">重量/kg:</span> 2.5</div>
                <div><span class="mySpan">数量:</span> 5</div>
              </div>
            </el-col>
          </el-row>
        </li>
      </ul>

      <el-pagination
        style="float: right; margin-top: 15px"
        layout="prev, pager, next"
        :total="70">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import commodity from "../../api/commodity";

  export default {
    name: "info",
    created() {
      this.id = this.$route.query.id
      this.init()
    },
    data() {
      return {
        id: 0,
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
        price: 1000000.0,
        info: [],
        stock: 0,
        infoId: 0,
      }
    },
    methods: {
      init() {
        commodity.getInfo(this.id).then(response => {
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
            if (this.price > k.price) {
              this.price = k.price
            }
            if (!this.info[specification]) {
              this.info[specification] = {}
            }
            this.info[specification][weight] = {
              price: k.price,
              stock: k.stock
            }
            if (!this.info[weight]) {
              this.info[weight] = {}
            }
            this.info[weight][specification] = {
              price: k.price,
              stock: k.stock
            }
          }
          this.name = response.data.name
          this.shopName = response.data.shopName
          this.shopId = response.data.shopId
          this.urlList = response.data.urlList
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
      buy() {
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
