<template>
  <div>
    <el-table
      :data="orderList"
      style="width: 100%">
      <el-table-column
        prop="orderId"
        label="订单编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="userId"
        label="用户id"
        width="180">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="下单时间">
      </el-table-column>
      <el-table-column
        prop="status"
        label="订单状态">
      </el-table-column>
      <el-table-column
        label="操作">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "index",
    data(){
      return{
        orderList: [],
      }
    },
  }
</script>

<style scoped>

</style>
