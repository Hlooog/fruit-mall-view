<template>
  <div>
    <div style="width: 400px;
                height: 300px;
                border-radius: 30px;
                margin: 50px auto;
                box-shadow: 0 2px 4px">
      <h1 style="text-align: center;color: #909399">用户登录</h1>
      <el-form style="width: 380px; margin: 0 auto"
               :model="loginForm" :rules="rules"
               ref="loginForm" label-width="100px">
        <el-form-item label="手机号码" prop="phone">
          <el-input style="width: 220px" v-model="loginForm.phone" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item v-if="loginType" label="密码" prop="password">
          <el-input style="width: 220px" v-model="loginForm.password" placeholder="密码" show-password></el-input>
        </el-form-item>
        <el-form-item v-else label="验证码" prop="code">
          <el-input style="width: 130px" v-model="loginForm.code" placeholder="验证码"></el-input>
          <el-button v-if="hasCode" type="text" @click="obtain">获取验证码</el-button>
          <span v-else style="color: #20a0ff">{{num}} 秒</span>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 6%" type="primary" @click="login('loginForm')">登录</el-button>
          <el-button type="primary" @click="toRegister">注册</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 8%" v-if="loginType" type="text" @click="loginType = false">短信登录</el-button>
          <el-button style="margin-left: 8%" v-else type="text" @click="loginType = true">密码登录</el-button>
          <el-button type="text" @click="wxLogin">微信登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import user from "../api/user";
  import {setToken} from '../utils/auth'
  export default {
    name: "index",
    created() {
      let id = this.$route.query.uuid
      if (id) {
        user.wxLogin(id).then(response => {
          const { data } = response
          console.log(data)
          this.$store.commit('user/SET_TOKEN', data.token)
          this.$store.commit('user/SET_ID', data.id)
          this.$store.commit('user/SET_NAME', data.name)
          this.$store.commit('user/SET_AVATAR', data.avatar)
          this.$store.commit('user/SET_PHONE',data.phone)
          setToken(data.token)
          this.$router.push({ path: this.$route.query.redirect || '/' })
        })
      }
    },
    data() {
      return {
        loginForm: {
          phone: '',
          password: '',
          code: '',
        },
        rules: {
          phone: [
            {required: true, message: '手机号码不能为空',trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '验证码不能为空', trigger: 'blur'}
          ]
        },
        radio: '',
        hasCode: true,
        num: 60,
        loginType: true,
      }
    },
    methods: {
      obtain() {
        if (this.loginForm.phone != '') {
          user.send(this.loginForm.phone).then(() => {
            this.hasCode = false
            this.num = 60
            this.timing()
          })
        } else {
          this.$message({
            type: 'error',
            message: '请先填写手机号码',
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
      login() {
        this.$refs.loginForm.validate(v => {
          if (v) {
            if (this.loginType) {
              user.login(this.loginForm).then(response => {
                const { data } = response
                this.$store.commit('user/SET_TOKEN', data.token)
                this.$store.commit('user/SET_ID', data.id)
                this.$store.commit('user/SET_NAME', data.name)
                this.$store.commit('user/SET_AVATAR', data.avatar)
                this.$store.commit('user/SET_PHONE',data.phone)
                setToken(data.token)
                this.$router.push({ path: this.$route.query.redirect || '/' })
              })
            } else {
              user.smsLogin(this.loginForm).then(response => {
                const { data } = response
                this.$store.commit('user/SET_TOKEN', data.token)
                this.$store.commit('user/SET_ID', data.id)
                this.$store.commit('user/SET_NAME', data.name)
                this.$store.commit('user/SET_AVATAR', data.avatar)
                this.$store.commit('user/SET_PHONE',data.phone)
                setToken(data.token)
                this.$router.push({ path: this.$route.query.redirect || '/' })
              })
            }
          } else {
            return false
          }
        })
      },
      toRegister(){
        this.$router.push('/register')
      },
      wxLogin(){
        window.location.href = "http://localhost:8150/api/ucenter/wx/login"
      }
    }
  }
</script>

<style scoped>

</style>
