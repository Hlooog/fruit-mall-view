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

      <el-col :span="6">
        <el-button type="text" style="margin: 30px 15%" @click="exportData">导出数据</el-button>
        <el-button type="text" style="margin: 30px 0%" @click="showBulkShip">批量发货</el-button>
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
            <el-button type="text" @click="fillIn(scope.row.id)">填写快递单号</el-button>
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

    <el-dialog width="40%" :visible.sync="visible">
      快递单号：
      <el-input style="width: 220px" v-model="trackNumber"></el-input>
      <el-button type="primary" style="margin-left: 10%" @click="submit">确认</el-button>
    </el-dialog>

    <el-dialog width="30%" :visible.sync="shipVisible">
      <el-upload
        class="upload-demo"
        drag
        :on-success="shipSuccess"
        action="/fruit-mall/orders/bulk/ship"
        :headers="header">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip" style="color: red;
        font-weight: bold;
        font-size: 18px;
        ">请在导出的Excel表中填写对应行的快递单号</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import order from "@/api/order";
  import {accMul} from "@/utils/cal";

  export default {
    name: "toBeDelivered",
    created() {
      this.page.shopId = this.shop_id
      this.init()
      this.header["X-Token"] = this.token
    },

    computed: {
      ...mapGetters([
        'shop_id',
        'token'
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
          status: 1,
        },
        time: [],
        orderList: [],
        total: 10,
        visible: false,
        id: 0,
        trackNumber: '',
        shipVisible: false,
        header: {
          'X-Token': '',
        }
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
      fillIn(id) {
        this.id = id
        this.trackNumber = ''
        this.visible = true
      },
      submit() {
        let data = {
          id: this.id,
          trackNumber: this.trackNumber
        }
        order.ship(data).then(() => {
          let index = 0
          for (let i = 0; i < this.orderList.length; i++) {
            if (this.id === this.orderList[i].id) {
              index = i
              break
            }
          }
          this.visible = false
          this.orderList.splice(index, 1)
        })
      },
      calPrice(price, quantity) {
        return accMul(price, quantity)
      },
      exportData() {
        order.exportData(this.page).then(response => {
          window.location.href = response.data
        })
      },
      showBulkShip(){
        this.shipVisible = true
      },
      shipSuccess() {
        this.shipVisible = false
        this.$message({
          type: 'success',
          message: '批量发货成功',
          duration: 3000,
        })
        this.init()
      }
    }
  }
</script>

<style scoped>

</style>

