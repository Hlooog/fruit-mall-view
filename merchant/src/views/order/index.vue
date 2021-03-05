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
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-col>

      <el-col :span="6">
        <el-button type="text" style="margin: 30px 15%" @click="exportData">导出数据</el-button>
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
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        style="margin-top: 20px; text-align: center"
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
    name: "index",
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
          status: '',
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
      exportData() {
        order.exportData(this.page).then(response => {
          window.location.href = response.data
        })
      }
    }
  }
</script>

<style scoped>

</style>
