<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-input @change="keyChange"
                  v-model="page.phone"
                  style="width: 180px; margin: 25px 35%"
                  placeholder="按照手机号码查找"></el-input>
      </el-col>
      <el-col :span="8">
        <el-date-picker
          style="width: 360px; margin-top: 25px"
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          clearable
          @change="dateChange">
        </el-date-picker>
      </el-col>
      <el-col :span="6">
        <el-select v-model="page.status"
                   @change="init"
                   style="margin-top: 25px"
                   placeholder="请选择">
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
            <el-tag v-if="scope.row.status == 0">审核中</el-tag>
            <el-tag type="warning" v-else-if="scope.row.status == 1">打款中</el-tag>
            <el-tag type="success" v-else-if="scope.row.status == 2">完成提现</el-tag>
            <el-tag type="danger" v-else>拒绝提现</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        style="margin: 35px 40%"
        :current-page="page.cur"
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
    name: "Index",
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
        date: [],
        statusOption: [
          {
            label: '审核中',
            value: 0,
          },
          {
            label: '打款中',
            value: 1,
          },
          {
            label: '完成提现',
            value: 2,
          },
          {
            label: '被拒绝',
            value: 3,
          }
        ]
      }
    },
    methods: {
      init() {
        this.list = []
        this.total = 0
        if (this.page.phone.trim() != '') {
          withdraw.page(this.page).then(response => {
            if (response.data != null) {
              this.list = response.data.data
              this.total = response.data.total
            }
          })
        }
      },
      dateChange() {
        this.page.cur = 1
        if (this.date == null) {
          this.page.endTime = ''
          this.page.endTime = ''
        } else {
          this.page.startTime = this.date[0]
          this.page.endTime = this.date[1]
        }
        this.init()
      },
      keyChange() {
        this.page.cur = 1;
        this.init()
      },
    }
  }
</script>

<style scoped>

</style>
