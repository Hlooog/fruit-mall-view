<template>
  <div>
    <el-row style="margin-top: 15px;height: 50px">
    </el-row>
    <el-row>
      <el-table
        style="width: 60%;margin-left: 15%"
        :data="userList">
        <el-table-column
          prop="id"
          label="客服id"
          width="80">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          width="120">
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="客服昵称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
              <el-popover
                placement="top"
                width="100"
                :value="uid == scope.row.id">
                <p>是否取消该客服身份？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="uid = 0">取消</el-button>
                  <el-button type="primary" size="mini" @click="cancelService">确定</el-button>
                </div>
                <el-button slot="reference" type="success"
                           @click="isCancelService(scope.row.id)">取消客服身份
                </el-button>
              </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  import user from "@/api/user";

  export default {
    name: "service",
    created() {
      this.init()
    },
    data() {
      return {
        userList: [],
        uid: 0
      }
    },
    methods: {
      init() {
        user.getService().then(response => {
          this.userList = response.data
        })
      },

      isCancelService(id) {
        this.uid = id
      },
      cancelService() {
        user.cancelService(this.uid).then(()=>{
          this.uid = 0
          this.init()
        })
      },
    },
  }
</script>

<style scoped>

</style>
