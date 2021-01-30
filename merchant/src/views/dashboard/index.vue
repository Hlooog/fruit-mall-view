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

    <el-dialog
      :visible.sync="withdrawVisible"
      title="提现"
      width="40%">
      <el-form :model="withdraw" label-width="160px" ref="withdraw" :rules="rules">
        <el-form-item prop="account" label="提现账户">
          <el-input style="width: 160px" v-model.number="withdraw.account" placeholder="请输入银行卡号"></el-input>
        </el-form-item>
        <el-form-item prop="amount" label="需要提现金额">
          <el-input style="width: 160px" v-model.number="withdraw.amount"
                    :placeholder="'最多可提现'+balance.withdrawAble + '元'"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input style="width: 160px" v-model.number=" withdraw.phone" placeholder='请输入手机号码'></el-input>
        </el-form-item>
        <el-form-item prop="code" label="验证码">
          <el-input style="width: 160px" v-model.number="withdraw.code" placeholder="请先获取验证码"></el-input>
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

  export default {
    name: 'Dashboard',
    created() {
      this.getBalance()
    },
    data() {
      const validatePrice = (rule, value, callback) => {
        if (this.withdraw.amount > this.balance.withdrawAble) {
          callback(new Error('Please enter the correct user name'))
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
        withdraw: {},
        rules: {
          account: [
            {required: true, message: '提现账户不能为空', trigger: 'blur'},
            {type: 'number', message: '请输入正确的账户', trigger: 'blur'},
          ],
          amount: [
            {required: true, message: '提现金额不能为空', trigger: 'blur'},
            {type: 'number', message: '金额不正确', trigger: 'blur'},
            {message: '请输入正确的金额', validator: validatePrice}
          ],
          phone: [
            {required: true, message: '手机号码不能为空', trigger: 'blur'},
            {type: 'number', message: '手机号码格式不正确', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '验证码不能为空', trigger: 'blur'},
            {type: 'number', message: '请输入正确的验证码', trigger: 'blur'}
          ]
        },
        hasCode: true,
        num: 60
      }
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
      submit(valid){
        this.$refs[valid].validate((v) => {
          if (v) {
            balance.withdraw(this.withdraw).then(()=> {
              this.getBalance()
            })
          } else {
            return false
          }
        })
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
    height: 180px;
    width: 80%;
    text-align: center;
    color: #409EFF;
  }
</style>
