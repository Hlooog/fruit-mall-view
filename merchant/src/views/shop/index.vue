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
          <el-button type="danger" @click="closeVisible = true">关店</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog
      title="确定关店吗？"
      :visible.sync="closeVisible"
      width="30%">
      <el-form :model="close" ref="close" label-width="80xp" :rules="closeRule">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="close.phone" style="width: 220px" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="验证码">
          <el-input style="width: 160px" v-model="close.code" placeholder="请先获取验证码"></el-input>
          <el-button v-if="hasCode" type="text" @click="obtain">获取验证码</el-button>
          <span v-else style="color: #20a0ff">{{num}} 秒</span>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" style="margin-left: 25%" @click="closeShop">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import shop from "@/api/shop";
  import city from "@/api/city";
  import {removeToken} from "@/utils/auth";
  import {resetRouter} from "@/router";

  export default {
    name: "index",
    created() {
      if (this.shop_id != 0) {
        this.getInfo()
      }
      this.getCity()
      this.close.shopId = this.shop_id
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
        closeRule: {
          phone: [
            {required: true, message: '手机号码不能为空', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '验证码不能为空', trigger: 'blur'}
          ]
        },
        cityList: [],
        cityId: 0,
        closeVisible: false,
        close: {},
        hasCode: true,
        num: 60,
        closeRule: {
          phone: [
            {required: true, message: '手机号不能为空', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '验证码不能为空', trigger: 'blur'}
          ]
        }
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
      },
      obtain() {
        if (this.withdraw.phone) {
          shop.sendMsg(this.withdraw.phone).then(() => {
            this.hasCode = false
            this.timing()
          })
        }
      },
      timing() {
        if (this.num == 0) {
          this.hasCode = true
        } else {
          setTimeout(() => {
            this.num -= 1
            this.timing()
          }, 1000)
        }
      },
      closeShop(){
        this.$refs.close.validate(v => {
          if (v) {
            shop.close(this.close).then(() => {
              removeToken() // must remove  token  first
              resetRouter()
              this.$store.commit('user/RESET_STATE')
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
