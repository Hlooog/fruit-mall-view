<template>
  <div>
    <div style="width: 80%;
                margin: 5% auto;
                border: #d3dce6 solid;
                border-radius: 15px;
                background: ghostwhite;">
      <el-button style="position: absolute; margin: 2% 3%" type="text" @click="fallback">返回</el-button>
      <h1 style="color: #5cb6ff; text-align: center">{{name}}</h1> <h5 style="margin-left: 80%;color: #5cb6ff">收藏数：
      {{info.heat}}</h5>
      <h5 style="height: auto;color: cornflowerblue; width: 220px; margin-left: 39%">
        <span>
        店铺简介： {{description}}<a class="el-icon-caret-bottom" style="color: #5cb6ff" @click="show"></a>
        </span>
      </h5>
      <div class="box ib" style="height: 700px; margin-top: 50px">
        <el-scrollbar style="height: 100%">
          <ul>
            <li v-for="(c,index) in commodityList" :key="index">
              <div>
                <div>
                  <el-image
                    style="width: 130px; height: 130px; margin-top: 8px"
                    :src="c.urlList[0]"
                    :preview-src-list="c.urlList">
                  </el-image>
                  <div>
                    <span>{{c.name}}</span>
                  </div>
                  <div>
                    <span>所属种类： {{c.varietyName}}</span>
                  </div>
                  <div>
                    <span style="color: gold">￥{{c.price}}</span>
                    <el-button v-if="c.isOnShelf" type="danger" @click="offShelf(c.id)" style="margin-left: 15px" size="small">下架</el-button>
                    <el-button v-else  disabled type="danger" style="margin-left: 15px" size="small">下架</el-button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
  import shop from "@/api/shop";

  export default {
    name: "commodity",
    created() {
      this.id = this.$route.query.id;
      this.name = this.$route.query.name
      this.fb = this.$route.query.cur
      this.getShop()
      this.getCommodityList()
    },
    data() {
      return {
        id: 0,
        name: '',
        fb: 0,
        info: {},
        description: '',
        mark: false,
        commodityList: [],
      }
    },
    methods: {
      getShop() {
        shop.getInfo(this.id).then(response => {
          this.info = response.data
          let desc = this.info.description
          desc = desc.substring(0, 10) + '...'
          this.description = desc
        })
      },
      getCommodityList() {
        shop.getCommodityList(this.id).then(response => {
          this.commodityList = response.data.data
        })
      },
      show() {
        if (!this.mark) {
          let desc = this.info.description
          desc = desc.substring(0, 10) + '...'
          this.description = desc
          this.mark = true
        } else {
          this.description = this.info.description
          this.mark = false
        }
      },
      fallback() {
        let fb = this.fb
        this.$router.push({path: '/shop/index', query: {cur: fb}})
      },
      offShelf(id){
        shop.offShelf(id).then(() => {
          this.getCommodityList()
        })
      }
    }
  }
</script>

<style>
  box {
    padding: 20px 10px;
    display: inline-block;
  }

  .box ul {
    overflow: hidden;
    width: 900px;
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
    margin: 0 10px;
    border-radius: 8px;
    text-align: center;
    line-height: 50px;
    background: lavenderblush;
  }

  .ib .el-scrollbar__wrap {
    overflow-x: hidden;
  }


</style>
