<template>
  <div class="dashboard-container">
    <el-row>
      <el-col :span="6">
        <el-card class="ic" shadow="always">
          <div>可提现金额</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="ic" shadow="always">
          <div>已提现金额</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="ic" shadow="always">
          <div>被冻结金额</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="ic" shadow="always">
          <div>总收入</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'Dashboard',
    computed: {
      ...mapGetters([
        'name'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

  .ic {
    height: 180px;
    width: 80%;
    text-align: center;
    color: #409EFF;
  }
</style>
