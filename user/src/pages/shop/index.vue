<template>
  <div>
    <el-card style="width: 80%; margin: 20px 10%">
      搜索关键字：
      <el-input v-model="page.key" @change="keyChange" style="width: 220px"></el-input>
      所在地： <el-cascader
      :options="cityList"
      :props="{ checkStrictly: true }"
      @change="cityIdChange"
      clearable
      filterable></el-cascader>
      <el-table :data="shopList" @row-click="click">
        <el-table-column prop="name" label="店铺名"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column prop="heat" label="收藏人数"></el-table-column>
        <el-table-column prop="userName" label="店主"></el-table-column>
        <el-table-column prop="city" label="所在城市"></el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center; margin-top: 25px"
        :current-page.sync="page.cur"
        @current-change="init"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import city from "../../api/city";
  import shop from "../../api/shop";

  export default {
    name: "index",
    created() {
      this.init()
      this.getCityInfo()
    },
    data() {
      return {
        shopList: [],
        page: {
          key: '',
          cur: 1,
          cityId: 0
        },
        cityList: [],
        total: 10,
      }
    },
    methods: {
      init() {
        shop.page(this.page).then(response => {
          this.shopList = response.data.data
          this.total = response.data.total
        })
      },
      keyChange(){
        this.page.cur = 1
        this.init()
      },
      cityIdChange(val){
        if (val.length == 0) {
          this.page.cityId = 0
        } else {
          this.page.cityId = val[val.length - 1]
        }
        this.page.cur = 1
        this.init()
      },
      getCityInfo() {
        city.getInfo().then(response => {
          this.cityList = response.data
        })
      },
      click(row,column,event){
        this.$store.dispatch('shop/setShop', row)
        this.$router.push({path: '/shop/info', query: {id: row.id}})
      }
    }
  }
</script>

<style scoped>

</style>
