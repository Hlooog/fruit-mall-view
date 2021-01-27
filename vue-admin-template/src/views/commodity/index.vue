<template>
  <div>
    <h1 style="text-align: center; color: darkgrey">{{shopName}}</h1>
    <el-form :inline="true" :model="page" class="demo-form-inline" style="margin-left: 30px; margin-top: 15px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="查询关键字">
            <el-input v-model="page.key" placeholder="关键字"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="15">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button type="primary" @click="back">返回</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="commodityList"
      style="width: 100%"
      :row-key="getRowkey"
      @expand-change="show"
      :expand-row-keys="expands">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.commodityName }}</span>
            </el-form-item>
            <el-form-item label="所属店铺">
              <span>{{ shopName }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.commodityId }}</span>
            </el-form-item>
            <el-form-item label="店铺 ID">
              <span>{{ page.shopId }}</span>
            </el-form-item>
            <el-form-item label="重量">
              <span>{{ sku.weight }}</span>
            </el-form-item>
            <el-form-item label="规格">
              <span>{{ sku.specification }}</span>
            </el-form-item>
            <el-form-item label="价格">
              <span>{{ sku.price }}</span>
            </el-form-item>
            <el-form-item label="库存">
              <span>{{ sku.stock }}</span>
            </el-form-item>
          </el-form>
          <el-button-group align="content">
            <el-button v-if="skuPage.cur > 0" type="primary" icon="el-icon-arrow-left" @click="pre">上一页</el-button>
            <el-button v-else type="primary" icon="el-icon-arrow-left" disabled>上一页</el-button>
            <el-button v-if="skuPage.cur < skuPage.total - 1" type="primary" @click="next">下一页<i
              class="el-icon-arrow-right el-icon--right"></i></el-button>
            <el-button v-else type="primary" disabled>下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        prop="commodityId"
        label="商品id"
        width="80">
      </el-table-column>
      <el-table-column
        prop="commodityName"
        width="80"
        label="商品名字">
      </el-table-column>
      <el-table-column
        label="商品图片">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.imageList[0]"
            :preview-src-list="scope.row.imageList">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="100">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间"
        width="100">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="offShelf(scope.row.commodityId)" type="danger" round size="small">下架</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      style="margin-left: 400px;margin-top: 30px;margin-bottom: 60px"
      layout="sizes,prev, pager, next"
      @current-change="curChange"
      @size-change="sizeChange"
      :total="totalCount"
      :current-page="page.cur"
      :page-size="page.size"
      :page-sizes="[5,10,15,20]"
    >
    </el-pagination>
  </div>
</template>

<script>
  import commodity from "@/api/commodity";

  export default {
    created() {
      this.page.shopId = this.$route.query.shopId
      this.shopName = this.$route.query.shopName
      this.init()
    },
    methods: {
      init() {
        commodity.getList(this.page).then(response => {
          this.commodityList = response.data.records
          this.totalCount = response.data.total
        })
      },
      onSubmit() {
        this.init()
      },
      back() {
        this.$router.push("/shop/index")
      },
      curChange(cur) {
        this.page.cur = cur
        this.init()
      },
      sizeChange(size) {
        this.page.size = size
        this.init()
      },
      show(row, expandedRows) {
        this.skuPage.commodityId = row.commodityId
        this.skuPage.cur = 0
        this.getSkuInfo()
        if (expandedRows.length) {
          this.expands = []
          this.expands.push(row.commodityId)
        } else {
          this.expands = []
        }
      },
      getRowkey(row) {
        return row.commodityId
      },
      getSkuInfo() {
        commodity.getSkuInfo(this.skuPage).then(response => {
          this.sku = response.data.data
          this.skuPage.total = response.data.total
        })
      },
      pre() {
        this.skuPage.cur = this.skuPage.cur - 1
        this.getSkuInfo()
      },
      next() {
        this.skuPage.cur = this.skuPage.cur + 1
        this.getSkuInfo()
      },
      offShelf(commodityId) {
        commodity.offShelf(commodityId).then(() => {
          this.init()
        })
      }
    },
    data() {
      return {
        commodityList: [],
        shopName: '',
        page: {
          shopId: 0,
          cur: 1,
          size: 10,
        },
        totalCount: 0,
        srcList: [],
        skuPage: {},
        sku: {
          weight: 0,
          specification: '',
          price: 0.0,
          stock: 0
        },
        expands: []
      }
    }
  }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
