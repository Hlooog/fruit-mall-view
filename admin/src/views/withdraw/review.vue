<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-input @change="keyChange"
                  v-model="page.phone"
                  style="width: 180px; margin: 25px 35%"
                  placeholder="按照手机号码查找"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="list" style="width: 65%; margin-left: 18%">
        <el-table-column prop="phone" label="手机号码" width="140"></el-table-column>
        <el-table-column prop="account" label="提现银行账户" width="200"></el-table-column>
        <el-table-column prop="amount" label="提现金额(元)" width="120"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="makeMoney(scope.row.id,scope.row.phone)">打款</el-button>
            <el-button type="text" @click="refuse(scope.row.id,scope.row.phone)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        style="margin-top: 20px; text-align: center"
        :current-page.sync="page.cur"
        @current-change="init"
        background
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import withdraw from "@/api/withdraw";

  export default {
    name: "review",
    created() {
      this.init()
    },
    data() {
      return {
        list: [],
        page: {
          phone: '',
          cur: 1,
          startTime: '',
          endTime: '',
          status: 0,
        },
        total: 10,
        date: []
      }
    },
    methods: {
      init() {
        withdraw.page(this.page).then(response => {
          this.list = response.data.data
          this.total = response.data.total
        })
      },
      keyChange() {
        this.page.cur = 1;
        this.init()
      },
      makeMoney(id,phone) {
        withdraw.review(id,phone).then(()=>{
          this.$message({
            type: 'success',
            message: '打款成功'
          })
          this.init()
        }).catch(()=>{
          this.$message({
            type: 'error',
            message: '打款失败'
          })
        })
      },
      refuse(id,phone) {
        withdraw.refuse(id,phone).then(()=>{
          this.$message({
            type: 'error',
            message: '已拒绝'
          })
          this.init()
        })
      }
    }
  }
</script>

<style scoped>

</style>
