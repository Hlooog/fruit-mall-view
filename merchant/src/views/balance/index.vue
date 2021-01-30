<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-date-picker
          style="margin:15px 15%"
          v-model="dates"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy年MM月dd日"
          value-format="yyyy-MM-dd"
          @change="dateChange">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        :data="lists"
        style="width: 100%">
        <el-table-column prop="phone" label="手机号码">
        </el-table-column>
        <el-table-column prop="account" label="收款账户">
        </el-table-column>
        <el-table-column prop="amount" label="提现金额(元)">
        </el-table-column>
        <el-table-column prop="createTime" label="提现时间">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0"><el-tag>审核中</el-tag></span>
            <span v-else-if="scope.row.status == 1"><el-tag type="danger">打款中</el-tag></span>
            <span v-else><el-tag type="success">完成提现</el-tag></span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        style="margin: 35px 40%"
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="page.cur"
        @current-change="init">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import balance from "@/api/balance";
  export default {
    name: "index",
    created() {
      this.page.phone = this.phone
      this.init()
    },
    computed: {
      ...mapGetters([
        'phone'
      ])
    },
    data(){
      return{
        page: {
          cur: 1,
          phone: '',
          startTime: '',
          endTime: '',
        },
        lists: [],
        total: 10,
        dates: [],
      }
    },
    methods: {
      init(){
        balance.getWithdraw(this.page).then(response => {
          this.lists = response.data.data
          this.total = response.data.total
        })
      },
      dateChange(){
        this.page.cur = 1
        if (this.dates == null) {
          this.page.startTime = ''
          this.page.endTime = ''
        } else {
          this.page.startTime = this.dates[0]
          this.page.endTime = this.dates[1]
        }
        this.init()
      }
    }
  }
</script>

<style scoped>

</style>
