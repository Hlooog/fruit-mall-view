<template>
  <div class="dashboard-container">
    <el-row>
      <el-col :span="6">
        <el-card class="ic" shadow="always">
          <div>可提现金额(元)</div>
          <div style="margin-top: 20%">
            <span style="color: #67C23A; font-size: 50px">
              {{balance.withdrawAble}}
            </span>
            <span style="font-size: 30px">
              / {{balance.lumpSum}}
            </span>
          </div>
          <div>
            <el-button type="text" @click="show">去提现</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="ic" shadow="always">
          <div>已提现金额(元)</div>
          <div style="margin-top: 20%">
            <span style="color: #F56C6C; font-size: 50px">
              {{balance.withdraw}}
            </span>
            <span style="font-size: 30px">
              / {{balance.lumpSum}}
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="ic" shadow="always">
          <div>被冻结金额(元)</div>
          <div style="margin-top: 20%">
            <span style="color: #E6A23C; font-size: 50px">
              {{balance.frozen}}
            </span>
            <span style="font-size: 30px">
              / {{balance.lumpSum}}
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="ic" shadow="always">
          <div>总收入(元)</div>
          <div style="margin-top: 20%">
            <span style="font-size: 50px">
              {{balance.lumpSum}}
            </span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <h1 style="text-align: center">水果销量</h1>
    <el-row>
      <div id="sales" style="width: 100%; min-height: 500px"></div>
      <div style="height: 20px"></div>
      <el-select v-model="commodityId" placeholder="请选择水果" @change="idChange">
        <el-option
          v-for="item in fruit"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <div id="oneSales" style="width: 100%; min-height: 500px"></div>
    </el-row>

    <h1 style="text-align: center">订单数据</h1>
    <el-row style="margin-top: 55px">
      <div id="order" style="width: 100%; min-height: 500px"></div>
      <div id="price" style="width: 100%; min-height: 500px"></div>
    </el-row>
    <el-dialog
      :visible.sync="withdrawVisible"
      title="提现"
      width="40%">
      <el-form :model="withdraw" label-width="160px" ref="withdraw" :rules="rules">
        <el-form-item prop="account" label="提现账户">
          <el-input style="width: 160px" v-model="withdraw.account" placeholder="请输入银行卡号"></el-input>
        </el-form-item>
        <el-form-item prop="amount" label="需要提现金额">
          <el-input style="width: 160px" v-model="withdraw.amount"
                    :placeholder="'最多可提现'+balance.withdrawAble + '元'"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input style="width: 160px" v-model=" withdraw.phone" placeholder='请输入手机号码'></el-input>
        </el-form-item>
        <el-form-item prop="code" label="验证码">
          <el-input style="width: 160px" v-model="withdraw.code" placeholder="请先获取验证码"></el-input>
          <el-button v-if="hasCode" type="text" @click="obtain">获取验证码</el-button>
          <span v-else style="color: #20a0ff">{{num}} 秒</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('withdraw')">提现</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import balance from "@/api/balance";
  import {mapGetters} from 'vuex';
  import order from "@/api/order";
  import commodity from "@/api/commodity";

  export default {
    name: 'Dashboard',
    created() {
      this.getBalance()
      this.showOrder()
      this.showPrice()
      this.showSales()
      this.initFruit()
      this.withdraw.shopId = this.shop_id
    },
    data() {
      const validatePrice = (rule, value, callback) => {
        if (this.withdraw.amount > this.balance.withdrawAble) {
          callback(new Error('提现金额大于可提现金额'))
        } else {
          callback()
        }
      }
      return {
        balance: {
          withdraw: 0.00,
          withdrawAble: 0.00,
          frozen: 0.00,
          lumpSum: 0.00
        },
        withdrawVisible: false,
        withdraw: {
          shopId: 0,
          phone: '',
        },
        rules: {
          account: [
            {required: true, message: '提现账户不能为空', trigger: 'blur'},
          ],
          amount: [
            {required: true, message: '提现金额不能为空', trigger: 'blur'},
            {message: '请输入正确的金额', validator: validatePrice}
          ],
          phone: [
            {required: true, message: '手机号码不能为空', trigger: 'blur'},
          ],
          code: [
            {required: true, message: '验证码不能为空', trigger: 'blur'},
          ]
        },
        hasCode: true,
        num: 60,
        ox: [],
        oy: [],
        px: [],
        py: [],
        sx: [],
        sy: [],
        osx: [],
        osy: [],
        fruit: [],
        commodityId: '',
      }
    },
    computed: {
      ...mapGetters([
        'shop_id',
      ])
    },
    methods: {
      getBalance() {
        balance.get().then(response => {
          if (response.data != null) {
            this.balance = response.data
          }
        })
      },
      show() {
        this.withdrawVisible = true
      },
      obtain() {
        if (this.withdraw.phone) {
          balance.sendMsg(this.withdraw.phone).then(() => {
            this.hasCode = false
            this.timing()
          })
        }
      },
      timing() {
        if (this.num == 0) {
          this.hasCode = true
        } else {
          setTimeout(() => {
            this.num -= 1
            this.timing()
          }, 1000)
        }
      },
      submit(valid) {
        this.$refs[valid].validate((v) => {
          if (v) {
            balance.withdraw(this.withdraw).then(() => {
              this.getBalance()
              this.withdrawVisible = false
              this.$message({
                type: 'success',
                message: '申请提现成功',
                duration: 1000,
              })
            })
          } else {
            return false
          }
        })
      },

      showOrder() {
        this.ox = []
        this.oy = []
        order.getNumberReport(this.shop_id).then(response => {
          let list = response.data
          for (let i = 0; i < list.length; i++) {
            this.ox.push(list[i].date)
            this.oy.push(list[i].number)
          }
          this.orderChart()
        })
      },

      orderChart() {
        let oChart = this.$echarts.init(document.getElementById("order"));
        let option = {
          title: {
            text: "订单数量"
          },
          tooltip: {
            trigger: 'axis'
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: true},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          xAxis: {
            name: '日期',
            type: 'category',
            data: this.ox
          },
          yAxis: {
            name: '数量',
          },
          series: [
            {
              type: "line",
              data: this.oy
            },
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        oChart.setOption(option);
      },

      showPrice() {
        this.px = []
        this.py = []
        order.getPriceReport(this.shop_id).then(response => {
          let list = response.data
          for (let i = 0; i < list.length; i++) {
            this.px.push(list[i].date)
            this.py.push(list[i].price)
          }
          this.priceChart()
        })
      },

      priceChart() {
        let oChart = this.$echarts.init(document.getElementById("price"));
        let option = {
          title: {
            text: "销售金额"
          },
          tooltip: {
            trigger: 'axis'
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: true},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          xAxis: {
            name: '日期',
            type: 'category',
            data: this.px
          },
          yAxis: {
            name: '金额',
          },
          series: [
            {
              type: "line",
              data: this.py
            },
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        oChart.setOption(option);
      },

      showSales() {
        this.sx = []
        this.sy = []
        commodity.getSales(this.shop_id).then(response => {
          let list = response.data
          for (let i = 0; i < list.length; i++) {
            this.sx.push(list[i].name)
            this.sy.push(list[i].sales)
          }
          this.salesChart()
        })
      },

      salesChart() {
        let sChart = this.$echarts.init(document.getElementById("sales"));
        let option = {
          title: {
            text: "水果销量"
          },
          tooltip: {
            trigger: 'axis'
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: true},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          xAxis: {
            name: '水果',
            type: 'category',
            data: this.sx
          },
          yAxis: {
            name: '销量',
          },
          series: [
            {
              type: 'bar',
              data: this.sy
            },
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        sChart.setOption(option);
      },

      initFruit() {
        commodity.getAllFruit(this.shop_id).then(response => {
          this.fruit = response.data
          console.log(this.fruit)
        })
      },
      idChange() {
        this.osx = []
        this.osy = []
        commodity.getOneSales(this.commodityId).then(response => {
          let list = response.data
          for (let i = 0; i < list.length; i++) {
            this.osx.push(list[i].date)
            this.osy.push(list[i].number)
          }
          this.oneFruitChart()
        })
      },
      oneFruitChart() {
        let oChart = this.$echarts.init(document.getElementById("oneSales"));
        let option = {
          title: {
            text: "水果销量"
          },
          tooltip: {
            trigger: 'axis'
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: true},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          xAxis: {
            name: '日期',
            type: 'category',
            data: this.osx
          },
          yAxis: {
            name: '数量',
          },
          series: [
            {
              type: "line",
              data: this.osy
            },
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        oChart.setOption(option);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

  .ic {
    height: 220px;
    width: 80%;
    text-align: center;
    color: #409EFF;
  }
</style>
