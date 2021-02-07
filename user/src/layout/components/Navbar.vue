<template>
  <div>
    <div style="background:#F5F5F5; height: 35px">
      <ul id="menu">
        <li v-if="id" style="margin-top: 8px; width: 100px">
          <el-dropdown>
            <span style="color: #409EFF">
              {{name}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-avatar :src="avatar"/>
              </el-dropdown-item>
              <el-dropdown-item @click.native="toUser">账号管理</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li v-else style="width: 100px">
          <el-button type="text" style="margin-left: 15px" @click="toLogin">请登录 /</el-button>
          <el-button type="text" style="margin-left: -5px" @click="toRegister">注册</el-button>
        </li>
        <li>
          <el-button type="text" style="margin-left: 550px;" @click="toHome">首页</el-button>
        </li>
        <li>
          <el-button type="text" style="margin-left: 25px;" @click="toCommodity">更多商品</el-button>
        </li>
        <li>
          <el-button type="text" style="margin-left: 25px;">我的订单</el-button>
        </li>
        <li>
          <el-button type="text" style="margin-left: 25px;">我的购物车</el-button>
        </li>
        <li>
          <el-button type="text" style="margin-left: 25px;">我的收藏</el-button>
        </li>
        <li>
          <el-button type="text" style="margin-left: 25px;" @click="toMerchant">卖家中心</el-button>
        </li>
        <li style="margin-top: 8px; margin-left: 10px">
          <el-dropdown>
            <span style="color: #409EFF">
              申请开店<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="toApply">申请</el-dropdown-item>
              <el-dropdown-item @click.native="show">查看申请状态</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li>
          <el-button type="text" style="margin-left: 25px;" @click="toService">联系客服</el-button>
        </li>
      </ul>
    </div>
    <div class="line"></div>

    <el-dialog
      :visible.sync="applyVisible"
      title="申请状态">
      <el-steps style="margin: 0 150px; width: 400px" :space="200" :active="active">
        <el-step title="审核中"></el-step>
        <el-step title="审核成功" @click.native="click" description="点击通往商家后台"></el-step>
        <el-step title="拒绝"></el-step>
      </el-steps>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import user from "../../api/user";
  import merchant from "../../api/merchant";
  import {removeToken} from "../../utils/auth";
  import {resetRouter} from '../../router/index'

  export default {
    computed: {
      ...mapGetters([
        'name',
        'id',
        'avatar',
      ])
    },
    created() {
    },
    data() {
      return {
        applyVisible: false,
        active: 0
      }
    },
    methods: {
      toLogin() {
        this.$router.push('/login?redirect=' + this.$router.currentRoute.fullPath)
      },
      toRegister() {
        this.$router.push('/register')
      },
      logout() {
        user.logout().then(() => {
          removeToken() // must remove  token  first
          resetRouter()
          this.$store.commit('user/RESET_STATE')
          this.$router.push("/")
        })
      },
      toMerchant() {
        window.open('http://localhost:8002')
      },
      toApply() {
        this.$router.push('/apply/index')
      },
      toHome() {
        this.$router.push("/")
      },
      show() {
        if (this.id) {
          merchant.getApply().then(response => {
            if (response.data != null) {
              this.active = response.data + 1
            }
            this.applyVisible = true
          })
        } else {
          this.$message({
            type: 'error',
            message: '请先登录',
          })
        }
      },
      click() {
        if (this.active == 2) {
          window.open('http://localhost:8002')
        }
      },
      toService() {
        this.$router.push('/service/index')
      },
      toUser() {
        this.$router.push('/user/index')
      },
      toCommodity(){
        this.$router.push('/commodity/index')
      }
    }
  }
</script>

<style scoped>
  #menu, #menu li {
    list-style: none; /* 将默认的列表符号去掉 */
  }

  #menu li {
    float: left; /* 往左浮动 */
  }
</style>
