<template>
  <div>
    <el-row style="margin-top: 15px;height: 50px">
      <el-col :span="1" style="height: 1px"></el-col>
      <el-col :span="6">
        <el-input style="width: 200px"
                  @change="keyChange"
                  v-model="page.key"
                  placeholder="可以根据手机号搜索哦"></el-input>
      </el-col>
      <el-col :span="6">
        <el-date-picker
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
    </el-row>
    <el-row>
      <el-table
        style="width: 100%"
        :data="userList">
        <el-table-column
          prop="id"
          label="用户id">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码">
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="用户昵称">
        </el-table-column>
        <el-table-column
          prop="violation"
          label="违规次数">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="banTime"
          label="解禁时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" @click="showBan(scope.row.id)">封号</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row style="width: 100%">
      <el-pagination
        style="position: absolute;
              left: 50%;
              transform: translateX(-50%);"
        background
        :current-page="page.cur"
        @current-change="init"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import user from '@/api/user'

  export default {
    created() {
      this.init()
    },
    data(){
      return {
        userList:[],
        page: {
          key:'',
          cur: 1,
          startTime: '',
          endTime: '',
        },
        date: [],
        total: 10,
      }
    },
    methods:{
      init(){
        user.page(this.page).then(response => {
          this.userList = response.data.data
          this.total = response.data.total
        })
      },
      dateChange(){
        this.page.cur = 1
        if (this.date == null) {
          this.page.endTime = ''
          this.page.endTime = ''
        } else {
          this.page.endTime = this.date[0]
          this.page.endTime = this.date[1]
        }
        this.init()
      },
      keyChange(){
        this.page.cur = 1;
        this.init()
      },
      showBan(id){
        console.log(id)
      }
    }
  }
</script>

<style scoped>

</style>
