<template>
  <div>
    <el-row style="height: 15px"></el-row>
    <el-row style="height: 50px">
      <el-col :span="2" style="height: 50px"></el-col>
      <el-col :span="8">
        <el-select v-model="status" placeholder="请选择" @change="statusChange">
          <el-option
            v-for="item in statusOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        :data="reviewList"
        stripe
        style="width: 100%">
        <el-table-column
          prop="userId"
          label="用户id"
          width="100">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="idCard"
          label="身份证号码"
          width="160">
        </el-table-column>
        <el-table-column
          prop="positive"
          label="身份证正面照"
          width="160">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.positive"
              :preview-src-list="[scope.row.positive]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="negative"
          label="身份证反面照"
          width="160">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.negative"
              :preview-src-list="[scope.row.negative]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="applyTime"
          label="申请时间"
          width="160">
        </el-table-column>
        <el-table-column
          label="审核操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status == 0" type="success" @click="review(scope.row.userId)">通过审核</el-button>
            <el-button v-if="scope.row.status == 0" type="danger" @click="refuse(scope.row.id)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  import user from '@/api/user'

  export default {
    name: "application",
    data() {
      return {
        reviewList: [],
        cur: 1,
        status: 0,
        total: 10,
        statusOption: [
          {
            value: 0,
            label: '未审核',
          },
          {
            value: 2,
            label: '不通过审核',
          }
        ]
      }
    },

    created() {
      this.getList()
    },
    methods: {

      getList() {
        user.getApply(this.cur, this.status).then(response => {
          this.reviewList = response.data.data
          this.total = response.data.total
        })
      },

      review(id) {
        user.review(id).then(() => {
          this.getList()
        })
      },
      refuse(id) {
        user.refuse(id).then(() => {
          this.getList()
        })
      },
      statusChange() {
        this.cur = 1
        this.getList()
      }
    }
  }
</script>

<style scoped>

</style>
