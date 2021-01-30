<template>
  <div>
    <el-card style="height: 500px; width: 500px; margin: 4% 28%" shadow="always">
      <el-form :model="info" :rules="rules" ref="info" label-width="150px">
        <el-form-item v-if="shop_id" label="店铺id">
          {{info.id}}
        </el-form-item>
        <el-form-item label="店铺名称" prop="name">
          <el-input maxlength="20" v-model="info.name" style="width: 60%"></el-input>
        </el-form-item>
        <el-form-item label="所在城市" prop="cityId">
          <el-cascader
            filterable
            :disabled="shop_id != 0"
            v-model="cityId"
            :options="cityList"
            :show-all-levels="false"
            style="width: 60%"
            @change="cityChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="店铺简介" prop="description">
          <el-input type="textarea" rows="7" v-model="info.description" maxlength="255"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="shop_id" type="primary" @click="submit('info')">修改店铺信息</el-button>
          <el-button v-else type="primary" @click="submit('info')">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import shop from "@/api/shop";
  import city from "@/api/city";

  export default {
    name: "index",
    created() {
      if (this.shop_id != 0) {
        this.getInfo()
      }
      this.getCity()
    },
    computed: {
      ...mapGetters([
        'id',
        'shop_id',
      ])
    },
    data() {
      return {
        info: {},
        rules: {
          name: [
            {required: true, message: '店铺名不能为空', trigger: 'blur'},
            {min: 3, max: 20, message: '长度在3-20之间',trigger: 'blur'}
          ],
          cityId: [
            {required: true, message: '所在城市不能为空', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '店铺描述不能为空', trigger: 'blur'},
          ]
        },
        cityList: [],
        cityId: 0,
      }
    },
    methods: {
      getInfo() {
        shop.getInfo(this.id).then(response => {
          this.info = response.data
          this.cityId = this.info.cityId
          this.$store.commit('user/SET_SHOP_ID',this.info.id)
        })
      },
      getCity(){
        city.getInfo().then(response => {
          this.cityList = response.data
        })
      },
      cityChange(){
        this.info.cityId = this.cityId[this.cityId.length - 1]
      },
      submit(valid){
        this.$refs[valid].validate((validation) => {
          if (validation) {
            shop.CreateOrUpdate(this.info).then(() => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              if (this.create == 0){
                this.$store.commit('user/SET_CREATE',1)
              }
            })
          } else {
            return false
          }
        })
      }
    },
  }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
