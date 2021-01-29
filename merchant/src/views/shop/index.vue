<template>
  <div>
    <el-card style="height: 700px; width: 500px; margin: 4% 28%" shadow="always">
      <el-form :model="info" :rules="rules" ref="info" label-width="150px">
        <el-form-item label="店铺头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8002/fruit-mall/oss/upload"
            :show-file-list="false"
            :on-success="success"
            :before-upload="beforeAvatarUpload">
            <img v-if="info.avatar" :src="info.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="info.name" style="width: 60%"></el-input>
        </el-form-item>
        <el-form-item label="所在城市" prop="cityId">
          <el-cascader
            filterable
            :disabled="create === 1"
            v-model="cityId"
            :options="cityList"
            :show-all-levels="false"
            style="width: 60%"
            @change="cityChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="店铺简介" prop="description">
          <el-input type="textarea" rows="7" v-model="info.description" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('info')">立即创建</el-button>
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
      if (this.create == 1) {
        this.getInfo()
      }
      this.getCity()
    },
    computed: {
      ...mapGetters([
        'id',
        'create',
      ])
    },
    data() {
      return {
        info: {},
        rules: {},
        cityList: [],
        cityId: 0,
        urlList: []
      }
    },
    methods: {
      getInfo() {
        shop.getInfo(this.id).then(response => {
          this.info = response.data
          this.cityId = this.info.cityId
        })
      },
      getCity(){
        city.getInfo().then(response => {
          this.cityList = response.data
        })
      },
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
      success(res,file){
        this.info.urlList.push(this.info.avatar)
        this.info.avatar = res.data
      },
      cityChange(){
        this.info.cityId = this.cityId[this.cityId.length - 1]
      },
      submit(valid){
        this.$refs[valid].validate((validation) => {
          if (validation) {
            shop.CreateOrUpdate(this.info,this.id)
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
