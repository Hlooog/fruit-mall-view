<template>
  <div>
    <div>
      <el-card style="width: 950px; margin: 0 auto">
        <span style="color: #606266">所有分类></span>
        <el-checkbox-group v-model="data.select" style="width: 900px;">
          <el-checkbox v-for="(item,index) in varietyList" :label="item.id" :key="index">
            {{item.name}}
          </el-checkbox>
        </el-checkbox-group>
        <div style="height: 15px"></div>
        <div>
          <span style="color: #606266">价格区间></span>
          <el-input
            placeholder="￥"
            style="width: 100px"
            size="mini"
            v-model="data.min"
            clearable>
          </el-input>
          ---
          <el-input
            placeholder="￥"
            style="width: 100px"
            size="mini"
            v-model="data.max"
            clearable>
          </el-input>
          <el-button type="primary" style="margin-left: 55%" size="mini" @click="submit">确定</el-button>
        </div>
        <el-divider></el-divider>
        <div class="box">
          <ul>
            <span v-if="!loading && commodityList.length === 0" style="width:500px;margin-left: 40%">暂无该分类商品，请选择其他分类</span>
            <li v-else v-for="(c,index) in commodityList" :key="index" @click="toInfo(c.id)">
              <div>
                <div>
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
              </div>
            </li>
          </ul>
          <p v-if="loading" style="margin-left: 50%" class="el-icon-loading"></p>
          <p v-if="this.data.cur === -1 && this.commodityList.length > 0" style="margin: 0 auto; width: 80px">没有更多了</p>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
  import commodity from "../../api/commodity";

  export default {
    name: "index",
    created() {
      this.initVariety()
      this.initCommodity()
    },
    data() {
      return {
        commodityList: [],
        varietyList: [],
        data: {
          select: [],
          min: '',
          max: '',
          cur: 1,
        },
        bar: {},
        loading: false
      }
    },

    mounted() {
      this.load()
    },

    methods: {
      initVariety() {
        commodity.getVarietyList().then(response => {
          this.varietyList = response.data
        })
      },
      initCommodity() {
        if (this.data.cur !== -1) {
          this.loading = true
          commodity.getCommodity(this.data).then(response => {
            this.commodityList.push(...response.data)
            this.data.cur += 1
            if (response.data.length < 8) {
              this.data.cur = -1
            }
            this.loading = false
          })
        }
      },
      submit() {
        this.data.cur = 1
        this.commodityList = []
        this.initCommodity()
      },
      load() {
        let _this = this
        window.onscroll = function () {
          //变量scrollTop是滚动条滚动时，距离顶部的距离
          let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          //变量windowHeight是可视区的高度
          let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
          //变量scrollHeight是滚动条的总高度
          let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
          //滚动条到底部的条件
          if (scrollTop + windowHeight == scrollHeight) {
            _this.initCommodity()
          }
        }
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
    width: 800px;
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

  /*.ib .el-scrollbar__wrap {
    overflow-x: hidden;
  }*/
</style>
