<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-input v-model.number="page.userId"
                  style="width: 220px; margin: 30px 15%"
                  placeholder="可以搜索用户id"
                  @change="keyChange"></el-input>
      </el-col>
      <el-col :span="10">
        <el-date-picker
          style="margin: 30px 15%"
          v-model="time"
          type="daterange"
          @change="timeChange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-col>

    </el-row>

    <el-row>
      <el-table :data="orderList">
        <el-table-column label="订单编号" prop="orderId" width="240" fixed='left'></el-table-column>
        <el-table-column label="商品名" prop="commodityName" width="120"></el-table-column>
        <el-table-column label="下单用户id" prop="userId" width="90"></el-table-column>
        <el-table-column label="订单详情" width="200">
          <template slot-scope="scope">
            <div>规格： {{scope.row.specification}}</div>
            <div>重量： {{scope.row.weight}}</div>
            <div>价格： {{scope.row.price}}</div>
            <div>数量： {{scope.row.quantity}}</div>
          </template>
        </el-table-column>
        <el-table-column label="收货信息" width="180">
          <template slot-scope="scope">
            <div>姓名： {{scope.row.name}}</div>
            <div>电话： {{scope.row.phone}}</div>
            <div>地址： {{scope.row.address}}</div>
          </template>
        </el-table-column>
        <el-table-column label="总价" width="80">
          <template slot-scope="scope">
            {{calPrice(scope.row.price,scope.row.quantity)}}
          </template>
        </el-table-column>
        <el-table-column label="快递单号" prop="trackNumber" width="150"></el-table-column>
        <el-table-column label="下单时间" prop="createTime" width="120"></el-table-column>
        <el-table-column label="订单状态" prop="statusStr" width="80"></el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="agree(scope.row.id)">退款</el-button>
            <el-button type="text" @click="refuse(scope.row.id)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        style="margin: 20px 40%"
        :current-page.sync="page.cur"
        layout="prev, pager, next"
        @current-change="init"
        :total="total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import order from "@/api/order";
  import {accMul} from "@/utils/cal";

  export default {
    name: "refund",
    created() {
      this.page.shopId = this.shop_id
      this.init()
    },

    computed: {
      ...mapGetters([
        'shop_id'
      ])
    },

    data() {
      return {
        page: {
          shopId: 0,
          userId: '',
          startTime: '',
          endTime: '',
          cur: 1,
          status: 4,
        },
        time: [],
        orderList: [],
        total: 10
      }
    },
    methods: {
      init() {
        order.page(this.page).then(response => {
          this.orderList = response.data.data
          this.total = response.data.total
        })
      },
      timeChange(val) {
        if (val) {
          this.page.startTime = val[0]
          this.page.endTime = val[1]
        } else {
          this.page.startTime = ''
          this.page.endTime = ''
        }
        this.page.cur = 1
        this.init()
      },
      keyChange() {
        if (typeof (this.page.userId) !== 'number') {
          this.page.userId = ''
        }
        this.page.cur = 1
        this.init()
      },
      calPrice(price,quantity){
        return accMul(price, quantity)
      },
      agree(id){
        order.agree(id).then(() => {
          let index = 0
          for (let i = 0; i < this.orderList.length; i++) {
            if (id === this.orderList[i].id) {
              index = i
              break
            }
          }
          this.orderList.splice(index,1)
        })
      },
      refuse(id){
        order.refuse(id).then(() => {
          let index = 0
          for (let i = 0; i < this.orderList.length; i++) {
            if (id === this.orderList[i].id) {
              index = i
              break
            }
          }
          this.orderList.splice(index,1)
        })
      }
    }
  }
</script>

<style scoped>

</style>

