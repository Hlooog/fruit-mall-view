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
          label="用户id"
          width="80">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          width="120">
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="用户昵称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="violation"
          label="违规次数"
          width="80">
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
            <div v-if="check(scope.row.createTime,scope.row.banTime)">
              <el-button type="danger" @click="showBan(scope.row.id)">封号</el-button>
              <el-popover
                placement="top"
                width="160"
                :value="uid == scope.row.id">
                <p>是否把该用户设为客服？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="uid = 0">取消</el-button>
                  <el-button type="primary" size="mini" @click="setService">确定</el-button>
                </div>
                <el-button style="margin-left: 15px" slot="reference" type="success" @click="isSetService(scope.row.id)">设为客服</el-button>
              </el-popover>
            </div>
            <div v-else>
              <el-button disabled type="danger">封号</el-button>
              <el-button disabled type="success">设为客服</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row style="width: 100%">
      <el-pagination
        style="margin-top: 20px; text-align: center"
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
  import user from '@/api/user'

  export default {
    created() {
      this.init()
    },
    data() {
      return {
        userList: [],
        page: {
          key: '',
          cur: 1,
          startTime: '',
          endTime: '',
        },
        date: [],
        total: 10,
        banVisible: false,
        days: -1,
        userId: 0,
        uid: 0
      }
    },
    methods: {
      init() {
        user.getGeneralList(this.page).then(response => {
          this.userList = response.data.data
          this.total = response.data.total
        })
      },

      check(createTime,banTime){
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
      dateChange() {
        this.page.cur = 1
        if (this.date == null) {
          this.page.endTime = ''
          this.page.endTime = ''
        } else {
          this.page.startTime = this.date[0]
          this.page.endTime = this.date[1]
        }
        this.init()
      },
      keyChange() {
        this.page.cur = 1;
        this.init()
      },
      showBan(id) {
        this.userId = id
        this.banVisible = true
      },
      ban() {
        if (this.days != -1) {
          user.banUser(this.userId,this.days).then(() => {
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

      isSetService(id) {
        this.uid = id
      },
      setService(){
        user.setService(this.uid).then(() => {
          this.uid = 0
          this.init()
        })
      }
    }
  }
</script>

<style scoped>

</style>
