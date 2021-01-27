<template>
  <div>
    <el-form :inline="true" :model="page" class="demo-form-inline" style="margin-left: 30px; margin-top: 15px">
      <el-form-item label="查询关键字">
        <el-input v-model="page.key" placeholder="关键字"></el-input>
      </el-form-item>
      <el-form-item label="创建时间范围">
        <el-date-picker
          v-model="dateTime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="timeChange"
          align="right">
        </el-date-picker>
      </el-form-item>
      <el-cascader
        placeholder="输入你要搜索的城市"
        :options="cityList"
        filterable
        clearable
        :props="{ checkStrictly: true}"
        @change="cityChange"></el-cascader>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="shopList"
      style="width: 100%">
      <el-table-column
        prop="ownerName"
        label="店主"
        width="80">
      </el-table-column>
      <el-table-column
        prop="shopName"
        label="店名">
      </el-table-column>
      <el-table-column
        label="描述">
        <template slot-scope="scope">
          <span>
            {{scope.row.description.length > 10 ? scope.row.description.slice(0,11) + '...' : scope.row.description}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="heat"
        label="关注人数"
        width="80">
      </el-table-column>
      <el-table-column
        prop="cityName"
        label="所在城市"
        width="80">
      </el-table-column>
      <el-table-column
        prop="violation"
        label="违规次数"
        width="80">
      </el-table-column>
      <el-table-column
        label="解封时间"
        width="100">
        <template slot-scope="scope">
          <span v-if="compareTime(scope.row.banTime,scope.row.createTime) === 0">{{scope.row.banTime}}</span>
          <span v-if="compareTime(scope.row.banTime,scope.row.createTime) === 1">未封店</span>
          <span v-if="compareTime(scope.row.banTime,scope.row.createTime) === -1">永久封店</span>
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
          <el-button v-if="compareTime(scope.row.banTime,scope.row.createTime) === 1" type="danger" round size="small"
                     @click="openDialog(scope.row.ownerId,scope.row.shopId)">封店
          </el-button>
          <el-button v-else type="danger" round size="small" disabled>封店</el-button>

          <el-button v-if="compareTime(scope.row.banTime,scope.row.createTime) === -1" type="text" size="small"
                     disabled>店内商品
          </el-button>
          <el-button v-else type="text" size="small" @click="showFruit(scope.row.shopId,scope.row.shopName)">店内商品</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="请选择禁言时间"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-radio v-model="degree" label="1">一天</el-radio>
      <el-radio v-model="degree" label="2">三天</el-radio>
      <el-radio v-model="degree" label="3">七天</el-radio>
      <el-radio v-model="degree" label="4">三十天</el-radio>
      <el-radio v-model="degree" label="5">一年</el-radio>
      <el-radio v-model="degree" label="6">永久</el-radio>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="mute">确 定</el-button>
      </span>
    </el-dialog>

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
  import city from '@/api/city'
  import shop from '@/api/shop'

  export default {
    created() {
      this.getCityInfo()
      this.getShopList(this.page)
    },

    methods: {
      compareTime(time, createTime) {
        let now = new Date()
        let new_time = new Date(time)
        let create_time = new Date(createTime)
        if (create_time.getTime() > new_time.getTime()) {
          return -1
        }
        if (new_time.getTime() > now.getTime()) {
          return 0
        } else {
          return 1
        }
      },

      getCityInfo() {
        city.getInfo().then(response => {
          this.cityList = response.data
        })
      },
      cityChange(arr) {
        this.page.cityId = arr.length == 2 ? arr[1] : arr[0];
      },
      timeChange() {
        if (this.dateTime == null) {
          this.page.startTime = null
          this.page.endTime = null
        } else {
          this.page.startTime = this.dateTime[0]
          this.page.endTime = this.dateTime[1]
        }
      },
      curChange(cur) {
        this.page.cur = cur
        this.getShopList(this.page)
      },
      sizeChange(size) {
        this.page.size = size
        this.getShopList(this.page)
      },
      onSubmit() {
        this.getShopList(this.page)
      },
      getShopList(page) {
        shop.page(page).then(response => {
          this.shopList = response.data.records
          this.totalCount = response.data.total
        })
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      openDialog(userId, shopId) {
        this.dialogVisible = true
        this.userId = userId
        this.shopId = shopId
      },
      mute() {
        shop.mute(this.shopId, this.degree).then(() => {
          this.getShopList(this.page)
          this.dialogVisible = false
          this.degree = 0
        })
      },
      showFruit(shopId,shopName) {
        this.$router.push({path: '/commodity/index', query: {'shopId': shopId,'shopName':shopName}})
      }
    },

    data() {
      return {
        shopList: [],
        page: {
          cur: 1,
          size: 10,
        },
        cityList: [],
        dateTime: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        totalCount: 10,
        degree: 0,
        userId: 0,
        shopId: 0,
        dialogVisible: false
      }
    }

  }
</script>

<style scoped>

</style>
