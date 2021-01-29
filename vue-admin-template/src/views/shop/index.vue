<template>
  <div>
    <el-row style="margin-top: 15px;height: 50px">
      <el-col :span="1" style="height: 1px"></el-col>
      <el-col :span="6">
        <el-input style="width: 200px"
                  @change="keyChange"
                  v-model="page.key"
                  placeholder="用户id、店铺id和店铺名"></el-input>
      </el-col>
      <el-col :span="8">
        <el-date-picker
          style="width: 80%"
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          clearable
          @change="dateChange">
        </el-date-picker>
      </el-col>
      <el-col :span="4">
        <el-cascader
          :options="cityList"
          :props="{ checkStrictly: true }"
          @change="cityIdChange"
          clearable
          filterable></el-cascader>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        style="width: 100%"
        :data="shopList">
        <el-table-column
          prop="id"
          label="店铺id"
          width="80">
        </el-table-column>
        <el-table-column
          prop="ownerId"
          label="店主id"
          width="80">
        </el-table-column>
        <el-table-column
          prop="ownerName"
          label="店主姓名"
          width="80">
        </el-table-column>
        <el-table-column
          prop="shopName"
          label="店铺名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="cityName"
          label="所在城市"
          width="80">
        </el-table-column>
        <el-table-column
          prop="heat"
          label="收藏人数"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="violation"
          label="违规次数"
          width="80">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160">
        </el-table-column>
        <el-table-column
          prop="banTime"
          label="解禁时间"
          width="160">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <div v-if="check(scope.row.createTime,scope.row.banTime)">
              <el-button type="danger" @click="isBan(scope.row.id)">封店</el-button>
              <el-button type="text" @click="enterShop(scope.row.id,scope.row.shopName)">店内详情</el-button>
            </div>
            <div v-else>
              <el-button disabled type="danger">封店</el-button>
              <el-button disabled type="text">店内详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-row style="width: 100%">
      <el-pagination
        style="margin-left: 30%"
        background
        :current-page.sync="page.cur"
        @current-change="init"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </el-row>

    <el-dialog
      title="选择封号时间"
      :visible.sync="banVisible"
      width="30%">
      <el-radio v-model="days" label="0">1天</el-radio>
      <el-radio v-model="days" label="1">3天</el-radio>
      <el-radio v-model="days" label="2">7天</el-radio>
      <el-radio v-model="days" label="3">30天</el-radio>
      <el-radio v-model="days" label="4">365天</el-radio>
      <el-radio v-model="days" label="5">永久</el-radio>
      <span slot="footer" class="dialog-footer">
    <el-button @click="cancelBan">取 消</el-button>
    <el-button type="primary" @click="ban">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import city from '@/api/city'
  import shop from '@/api/shop'

  export default {
    created() {
      let c = this.$route.query.cur
      if (c){
        this.page.cur = c
      }
      this.getCityInfo()
      this.init()
    },
    computed:{

    },
    data() {
      return {
        cityList: [],
        shopList: [],
        total: 10,
        page: {
          cur: 1,
          key: '',
          startTime: '',
          endTime: '',
          cityId: 0,
        },
        date: [],
        sid: 0,
        banVisible: false,
        days: -1
      }
    },
    methods: {
      init(){
        shop.page(this.page).then(response => {
          this.shopList = response.data.data
          this.total = response.data.total
        })
      },
      getCityInfo() {
        city.getInfo().then(response => {
          this.cityList = response.data
        })
      },
      keyChange(){
        this.page.cur = 1
        this.init()
      },
      dateChange(){
        this.page.cur = 1
        if (this.date == null) {
          this.page.startTime = ''
          this.page.endTime = ''
        } else{
          this.page.startTime = this.date[0]
          this.page.endTime = this.date[1]
        }
        this.init()
      },
      cityIdChange(val){
        if (val.length == 0) {
          this.page.cityId = 0
        } else {
          this.page.cityId = val[val.length - 1]
        }
        this.init()
      },
      check(createTime, banTime) {
        let now = new Date()
        let create = new Date(createTime)
        let ban = new Date(banTime)
        if (ban.getTime() > now.getTime()
          || ban.getTime() < create.getTime()) {
          return false
        } else {
          return true
        }
      },
      isBan(id){
        this.sid = id
        this.banVisible = true
      },

      ban() {
        if (this.days != -1) {
          shop.banShop(this.sid,this.days).then(() => {
            this.days = -1
            this.init()
          })
          this.banVisible = false
        }else {
          this.$message({
            type: "warning",
            message: '请先选择封禁天数'
          })
        }
      },
      cancelBan() {
        this.days = -1
        this.banVisible = false
      },


      enterShop: function (id, name) {
        let c = this.page.cur
        this.$router.push({path: '/shop/commodity', query: {id: id, name: name, cur: c}})
      },
    },
  }
</script>

<style scoped>

</style>
