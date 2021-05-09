<template>
  <div>
    <el-card style="width: 80%; margin: 20px 10%">
      <el-button type="text" @click="fallBack">返回</el-button>
      <h1 style="margin-left: 43%; color: #f40">{{info.name}}</h1>
      <el-row>
        <el-col style="margin-left: 10%" :span="5">收藏数：{{info.heat}}</el-col>
        <el-col style="margin-left: 10%" :span="7">店长: {{info.userName}}</el-col>
        <el-col style="margin-left: 10%" :span="4">所在城市: {{info.city}}</el-col>
      </el-row>
      <div style="margin-top: 15px;">
        <span style="margin-left: 10%">店铺描述: {{info.description}}</span>
      </div>

      <el-divider></el-divider>
      <!--<div class="box">
        <ul>
          <li v-for="(c,index) in commodityList" :key="index" @click="toInfo(c.id)">
            <div>
              <div>-->
      <el-card style="float: left;
                    width: 17%;
                    margin-left: 7%;
                    text-align: center;
                    height: 230px;
                    margin-bottom: 10px;"
               v-for="(c,index) in commodityList" :key="index" @click="toInfo(c.id)">
        <div @click="toInfo(c.id)" style="cursor: pointer">
          <el-image
            style="width: 100px; height: 100px"
            :src="c.url"
            fit="fill"></el-image>
          <div>
            <span>{{c.name}}</span>
          </div>
          <div>
            <span>所属种类： {{c.varietyName}}</span>
          </div>
          <div>
            <span style="color: #F40; font-weight: 700">￥{{c.price}}</span>
          </div>
        </div>
      </el-card>
      <!--</div>
    </li>
  </ul>
</div>-->
    </el-card>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import shop from "../../api/shop";

  export default {
    name: "info",
    created() {
      this.id = this.$route.query.id
      this.init()
    },
    data() {
      return {
        id: 0,
        commodityList: []
      }
    },
    computed: {
      ...mapGetters([
        'info'
      ])
    },
    methods: {
      init() {
        shop.list(this.id).then(response => {
          this.commodityList = response.data
        })
      },
      fallBack() {
        this.$router.push('/shop/index')
      },
      toInfo(id) {
        this.$router.push({path: '/commodity/info', query: {id: id}})
      }
    }
  }
</script>

<style scoped>
  .box {
    padding: 20px 10px;
    display: inline-block;
  }

  .box ul {
    overflow: hidden;
    width: 1000px;
    margin-bottom: -10px;
    margin-top: 0;
  }

  .box li {
    list-style: none;
    float: left;
    width: 25%; /*可以用百分比*/
    height: 25%; /*可以用百分比*/
    margin-bottom: 10px;

  }

  .box li > div {
    border-radius: 8px;
    text-align: center;
    line-height: 25px;
    /*background: lavenderblush;*/
  }
</style>
