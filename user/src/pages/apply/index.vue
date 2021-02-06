<template>
  <div>
    <h1 style="margin-left: 48%;color: #909399">申请成为商家</h1>
    <el-form style="margin: 50px auto; width: 400px" :model="apply" ref="apply"
             :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="name">
        <el-input style="width: 220px" v-model="apply.name" placeholder="请填写你的姓名"/>
      </el-form-item>
      <el-form-item label="身份证号码" prop="idCard">
        <el-input style="width: 220px" v-model="apply.idCard" placeholder="请填写本人身份证号码"/>
      </el-form-item>
      <el-form-item label="身份证正面照" prop="positive">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8003/fruit-mall/oss/upload"
          :show-file-list="false"
          :on-success="positiveSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="apply.positive" :src="apply.positive" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="身份证反面" prop="negative">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8003/fruit-mall/oss/upload"
          :show-file-list="false"
          :on-success="negativeSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="apply.negative" :src="apply.negative" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button style="margin-left: 11%" type="primary" @click="submit">确定申请</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import merchant from "../../api/merchant";
  export default {
    name: "index",
    created() {
      this.apply.id = this.id
    },
    data(){
      return{
        apply: {
          id: '',
          name: '',
          idCard: '',
          positive: '',
          negative: '',
          urlList: [],
        },
        rules: {
          name: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          idCard: [
            {required: true, message: '身份证号码不能为空', trigger: 'blur'}
          ],
          positive: [
            {required: true, message: '身份证正面照不能为空', trigger: 'blur'}
          ],
          negative: [
            {required: true, message: '身份证反面照不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapGetters([
        'id'
      ])
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (!vm.$store.getters.id) {
          vm.$router.push('/login?redirect=' + vm.$router.currentRoute.fullPath)
        }
      })
    },
    methods:{
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      positiveSuccess(res, file){
        if (this.apply.positive != '') {
          this.apply.urlList.push(this.apply.positive)
        }
        this.apply.positive = res.data
      },
      negativeSuccess(res, file){
        if (this.apply.negative != '') {
          this.apply.urlList.push(this.apply.negative)
        }
        this.apply.negative = res.data
      },
      submit(){
        this.$refs.apply.validate(v => {
          if (v) {
            merchant.apply(this.apply).then(() => {
              this.$router.push('/')
            })
          } else {
            return false
          }
        })
      }
    }
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
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
</style>
