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
                <li v-for="(item,index) in hotList" :key="index" style="">

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
        <el-button type="text" style="margin-left: 85%">更多>></el-button>
        <el-divider></el-divider>
      </section>
    </div>
    <div style="margin-top: 5%">
      <section>
        <span style="color:#606266; margin-left: 4%">最近浏览</span>
        <el-button type="text" style="margin-left: 85%">更多>></el-button>
        <el-divider></el-divider>
      </section>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    created() {
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
      }
    },
    methods: {}
  }
</script>

<style>

  .box .el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>
