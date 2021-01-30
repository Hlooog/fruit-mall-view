<template>
  <div>
    <el-row>
      <el-button style="margin:25px 82%;font-size: 25px" type="text">添加水果</el-button>
    </el-row>
    <el-row>
      <el-table
        :data="lists"
        width="100%">
        <el-table-column prop="id" label="商品id" width="70">
        </el-table-column>
        <el-table-column prop="cname" label="商品名称" width="80">
        </el-table-column>
        <el-table-column prop="vname" label="所属种类" width="80">
        </el-table-column>
        <el-table-column label="图片" width="100">
          <template slot-scope="scope">
            <el-image></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="150">
        </el-table-column>
        <el-table-column label="具体信息" width="420">
          <template slot-scope="scope">
            <el-table :data="scope.row.list">
              <el-table-column label="规格" prop="specification" width="120"></el-table-column>
              <el-table-column label="重量" prop="weight" width="60"></el-table-column>
              <el-table-column label="库存" prop="stock" width="60"></el-table-column>
              <el-table-column label="价格" prop="price" width="60"></el-table-column>
              <el-table-column width="100">
                <template slot-scope="s">
                  <el-button type="text">修改</el-button>
                  <el-button type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isOnShelf" type="text">下架</el-button>
            <el-button v-else type="text">上架</el-button>
            <el-button type="text">修改</el-button>
            <el-button type="text">添加规格</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: "index",
    created() {
      this.init()
    },
    computed: {
      ...mapGetters([
        'shop_id'
      ])
    },
    data() {
      return {
        cur: 1,
        total: 10,
        lists: [
          {
            id: 1,
            cname: '苹果',
            vname: '苹果',
            createTime: '2021-01-01',
            isOnShelf: 0,
            list: [
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '果径(75mm(含) - 80mm(不含))',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              }
            ]
          },
          {
            id: 1,
            cname: '苹果',
            vname: '苹果',
            create: '2021-01-01',
            isOnShelf: 0,
            list: [
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              }
            ]
          },
          {
            id: 1,
            cname: '苹果',
            vname: '苹果',
            create: '2021-01-01',
            isOnShelf: 0,
            list: [
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              }
            ]
          },
          {
            id: 1,
            cname: '苹果',
            vname: '苹果',
            create: '2021-01-01',
            isOnShelf: 0,
            list: [
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              }
            ]
          },
          {
            id: 1,
            cname: '苹果',
            vname: '苹果',
            create: '2021-01-01',
            isOnShelf: 0,
            list: [
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              }
            ]
          },
          {
            id: 1,
            cname: '苹果',
            vname: '苹果',
            create: '2021-01-01',
            isOnShelf: 0,
            list: [
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              }
            ]
          },
          {
            id: 1,
            cname: '苹果',
            vname: '苹果',
            create: '2021-01-01',
            isOnShelf: 0,
            list: [
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              }
            ]
          },
          {
            id: 1,
            cname: '苹果',
            vname: '苹果',
            create: '2021-01-01',
            isOnShelf: 0,
            list: [
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              }
            ]
          },
          {
            id: 1,
            cname: '苹果',
            vname: '苹果',
            create: '2021-01-01',
            isOnShelf: 0,
            list: [
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              }
            ]
          },
          {
            id: 1,
            cname: '苹果',
            vname: '苹果',
            create: '2021-01-01',
            isOnShelf: 0,
            list: [
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              },
              {
                id: 0,
                specification: '优质蜜桔',
                weight: '5',
                stock: 1000,
                price: 52.00,
              }
            ]
          }
        ],
      }
    },
    methods: {
      init() {

      }
    }
  }
</script>

<style scoped>

</style>
