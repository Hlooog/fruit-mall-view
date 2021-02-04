<template>
  <div>
    <div style="background:#F5F5F5; height: 35px">
      <ul id="menu" style="margin-left: 60%">
        <li v-if="id"  style="margin-top: 8px; width: 100px">
          <el-dropdown>
            <span style="color: #409EFF">
              {{name}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-avatar :src="avatar"/>
              </el-dropdown-item>
              <el-dropdown-item>账号管理</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li v-else style="width: 100px">
          <el-button type="text" style="margin-left: 15px" @click="toLogin">请登录 /</el-button>
          <el-button type="text" style="margin-left: -5px" @click="toRegister">注册</el-button>
        </li>
        <li>
          <el-button type="text" style="margin-left: 15px">我的订单</el-button>
        </li>
        <li>
          <el-button type="text" style="margin-left: 15px">我的购物车</el-button>
        </li>
        <li>
          <el-button type="text" style="margin-left: 15px">我的收藏</el-button>
        </li>
        <li>
          <el-button type="text" style="margin-left: 15px">卖家中心</el-button>
        </li>
        <li>
          <el-button type="text" style="margin-left: 15px">联系客服</el-button>
        </li>
      </ul>
    </div>
    <div class="line"></div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import user from "../../api/user";
  import {removeToken} from "../../utils/auth";
  import { resetRouter } from '../../router/index'

  export default {
    computed: {
      ...mapGetters([
        'name',
        'id',
        'avatar',
      ])
    },
    created() {
      console.log(this.avatar)
    },
    data() {
      return {
        activeIndex: '1',
      }
    },
    methods: {
      toLogin(){
        this.$router.push('/login')
      },
      toRegister(){
        this.$router.push('/register')
      },
      logout(){
        user.logout().then(()=>{
          removeToken() // must remove  token  first
          resetRouter()
          this.$store.commit('user/RESET_STATE')
        })
      }
    }
  }
</script>

<style scoped>
  #menu, #menu li {
    list-style:none; /* 将默认的列表符号去掉 */
  }
  #menu li {
    float:left; /* 往左浮动 */
  }
</style>
