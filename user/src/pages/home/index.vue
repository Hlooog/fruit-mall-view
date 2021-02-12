<template>
  <div id="app">
    <div style="margin-top: 5%">
      <el-row>
        <el-col :span="16">
          <el-carousel height="400px" :loop="true">
            <el-carousel-item v-for="(item,index) in imgList" :key="index">
              <img style="width: 100%;
                    height: 100%;
                    background-size: cover;
                    border-radius: 25px" :src="item"/>
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="8">
          <div class="box" style="height: 300px; width: 380px; margin-left: 10%">
            <h1 style="color: #909399; text-align: center">本月热销</h1>
            <el-scrollbar style="height: 100%;"
                          ref="scrollbar">
              <ul style="overflow:auto">
                <li v-for="(item,index) in hotList" :key="index" style="list-style: none" @click="toInfo(item.id)">
                  <el-row>
                    <el-col :span="6">
                      <el-image :src="item.url" style="width: 70px; height: 70px; border-radius: 5px"></el-image>
                    </el-col>
                    <el-col :span="12">
                      <el-row style="height: 45px">
                        <span>{{item.name}}</span>
                      </el-row>
                      <el-row>
                        <span style="color: #F40; font-weight: 700">￥{{item.price}}</span>
                      </el-row>
                    </el-col>
                  </el-row>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 5%">
      <section>
        <span style="color:#606266; margin-left: 4%">猜你喜欢</span>
        <el-button type="text" style="margin-left: 85%" @click="toCommodity">更多>></el-button>
        <el-divider></el-divider>
        <ul>
          <li style="list-style: none;
                    float: left;
                    width: 12%;
                    margin-bottom: 10px;"
              v-for="(c,index) in likeList" :key="index" @click="toInfo(c.id)">
            <div>
              <div>
                <el-image
                  style="width: 100px; height: 100px; border-radius: 5px;"
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
            </div>
          </li>
        </ul>
      </section>
    </div>
    <!--<div style="margin-top: 5%">
      <section>
        <span style="color:#606266; margin-left: 4%">最近浏览</span>
        <el-button type="text" style="margin-left: 85%" @click="toCommodity">更多>></el-button>
        <el-divider></el-divider>
      </section>
    </div>-->
  </div>
</template>

<script>
  import commodity from "../../api/commodity";

  export default {
    name: "index",
    created() {
      this.getHot()
      this.getLike()
    },
    data() {
      return {
        imgList: [
          'https://hl-fruit-mall.oss-cn-guangzhou.aliyuncs.com/2021/02/04/706a44233ca943f9a9dae480f1f9b99bfile',
          'https://hl-fruit-mall.oss-cn-guangzhou.aliyuncs.com/2021/02/04/76f9445f7083435b9bc07a1272380accfile',
          'https://hl-fruit-mall.oss-cn-guangzhou.aliyuncs.com/2021/02/04/e4928d46b1854a73b2575b89a8ac1ac1file',
          'https://hl-fruit-mall.oss-cn-guangzhou.aliyuncs.com/2021/02/04/4124aa29722b466e8c87282be2b9025efile',
        ],
        hotList: [],
        likeList: [],
      }
    },
    methods: {
      getHot() {
        commodity.getHome().then(response => {
          this.hotList = response.data
        })
      },

      getLike(){
        commodity.getLike().then(response => {
          this.likeList = response.data
        })
      },

      toCommodity() {
        this.$router.push('/commodity/index')
      },
      toInfo(id) {
        this.$router.push({path: '/commodity/info', query: {id: id}})
      }
    },
  }
</script>

<style>

  .box li {
    cursor: pointer;
  }

  .box .el-scrollbar__wrap {
    overflow-x: hidden;
  }

</style>
