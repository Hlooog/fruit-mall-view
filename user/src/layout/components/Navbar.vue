<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu v-if="id" index="1">
        <template slot="title">
          <el-avatar :src="avatar"/>
        </template>
        <el-menu-item @click="toUser" index="1-1">账号管理</el-menu-item>
        <el-menu-item @click="logout" index="1-2">退出登录</el-menu-item>
      </el-submenu>
      <el-menu-item v-if="!id" @click="toLogin" index="2">登录</el-menu-item>
      <el-menu-item v-if="!id" @click="toRegister" index="3">注册</el-menu-item>
      <el-menu-item style="margin-left: 15%" index="4" @click="toHome">首页</el-menu-item>
      <el-menu-item index="5" @click="toCommodity">更多商品</el-menu-item>
      <el-menu-item index="6" @click="toShop">所有商家</el-menu-item>
      <el-menu-item index="7" @click="toOrder">我的订单</el-menu-item>
      <el-menu-item index="8" @click="toCar">我的购物车</el-menu-item>
      <el-menu-item index="9" @click="showKeep">我的收藏</el-menu-item>
      <el-menu-item index="10" @click="toMerchant">卖家中心</el-menu-item>
      <el-menu-item index="11" @click="showKeep">我的收藏</el-menu-item>
      <el-submenu index="12">
        <template slot="title">申请开店</template>
        <el-menu-item @click="toApply" index="12-1">申请</el-menu-item>
        <el-menu-item @click="show" index="12-2">查看申请状态</el-menu-item>
      </el-submenu>
      <el-menu-item index="13" @click="toService">联系客服</el-menu-item>
    </el-menu>

    <el-dialog
      :visible.sync="applyVisible"
      title="申请状态">
      <el-steps style="margin: 0 150px; width: 400px" :space="200" :active="active">
        <el-step title="审核中"></el-step>
        <el-step title="审核成功" @click.native="click" description="点击通往商家后台"></el-step>
        <el-step title="拒绝"></el-step>
      </el-steps>
    </el-dialog>

    <el-dialog
      :visible.sync="keepVisible"
      width="30%"
      title="我的收藏">
      <el-table :show-header="false" :data="keepList" style="width: 100%">
        <el-table-column>
          <template slot-scope="scope">
            <el-row>
              <span @click="toInfo(scope.row.id)" style="cursor: pointer;">
                <el-col :span="6">
                  <el-image :src="scope.row.url" style="width: 70px; height: 70px; border-radius: 5px"></el-image>
                </el-col>
                <el-col :span="12">
                  <el-row style="height: 45px">
                    <span>{{scope.row.name}}</span>
                  </el-row>
                  <el-row>
                    <span style="color: #F40; font-weight: 700">￥{{scope.row.price}}</span>
                  </el-row>
                </el-col>
              </span>
              <el-col :span="4">
                <el-button type="text" @click="cancelKeep(scope.row.id)">取消收藏</el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center"
        :current-page.sync="cur"
        @current-change="getKeepList"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import user from "../../api/user";
  import merchant from "../../api/merchant";
  import {removeToken} from "../../utils/auth";
  import {resetRouter} from '../../router/index'
  import commodity from "../../api/commodity";

  export default {
    computed: {
      ...mapGetters([
        'name',
        'id',
        'avatar',
      ])
    },
    data() {
      return {
        applyVisible: false,
        active: 0,
        keepList: [],
        total: 10,
        cur: 1,
        keepVisible: false,
        activeIndex: '0',
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
      toCommodity() {
        this.$router.push('/commodity/index')
      },
      showKeep() {
        if (this.id) {
          this.cur = 1
          this.getKeepList()
          this.keepVisible = true
        } else {
          this.$router.push('/login?redirect=' + this.$router.currentRoute.fullPath)
        }
      },
      getKeepList() {
        commodity.getKeepList(this.cur).then(response => {
          this.keepList = response.data.data
          this.total = response.data.total
        })
      },
      toInfo(id) {
        this.$router.push({path: '/commodity/info', query: {id: id}})
      },
      cancelKeep(id) {
        commodity.cancel(id).then(() => {
          let index = 0;
          for (let i = 0; i < this.keepList.length; i++) {
            if (id === this.keepList[i].id) {
              index = i
              break
            }
          }
          this.keepList.splice(index, 1)
        })
      },
      toCar() {
        this.$router.push('/car/index')
      },
      toOrder() {
        this.$router.push('/order/index')
      },
      toShop() {
        this.$router.push("/shop/index")
      },
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
