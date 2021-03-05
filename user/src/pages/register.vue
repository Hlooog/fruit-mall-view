<template>
  <div>
    <div style="height: 600px;
                  width: 500px;
                  border-radius: 30px;
                  margin: 40px auto;
                  box-shadow: 0 2px 4px">
      <h1 style="text-align: center;color: #909399">用户注册</h1>
      <el-form style="width: 380px; margin: 0 auto" :model="registerForm" :rules="rules" ref="registerForm"
               label-width="100px">
        <el-form-item prop="avatar" v-if="!registerForm.uuid">
          <el-upload
            class="avatar-uploader"
            style="text-align: center; width: 170px"
            action="http://localhost:8003/fruit-mall/oss/upload"
            :show-file-list="false"
            :on-success="success"
            :before-upload="beforeAvatarUpload">
            <el-avatar v-if="registerForm.avatar" :src="registerForm.avatar" class="avatar"></el-avatar>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="!registerForm.uuid" label="昵称" prop="name">
          <el-input style="width: 220px"  v-model="registerForm.name" placeholder="用户昵称"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input style="width: 220px" v-model="registerForm.phone" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input style="width: 220px" v-model="registerForm.password" placeholder="密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input style="width: 220px" v-model="registerForm.password2" placeholder="确认密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input style="width: 130px" v-model="registerForm.code" placeholder="验证码"></el-input>
          <el-button v-if="hasCode" type="text" @click="obtain">获取验证码</el-button>
          <span v-else style="color: #20a0ff">{{num}} 秒</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register">注册</el-button>
          <el-button style="margin-left: 6%" type="text" @click="toLogin">已有账号直接登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import user from "../api/user";
  import {setToken} from "../utils/auth";

  export default {
    name: "register",
    created() {
      this.registerForm.uuid = this.$route.query.uuid
    },
    data(){
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        registerForm: {
          phone: '',
          name: '',
          password: '',
          password2: '',
          code: '',
          avatar: '',
          urlList: [],
          uuid: '',
        },
        rules: {
          avatar: [
            {required: true, message: '请上传头像', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '手机号码不能为空', trigger: 'blur'}
          ],
          password:[
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          password2: [
            {validator: validatePass2, trigger: 'blur'}
          ],
          code: [
            {required: true, message: '验证码不能为空', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '昵称不能为空', trigger: 'blur'}
          ]
        },
        hasCode: true,
      }
    },
    methods: {
      toLogin(){
        this.$router.push('/login')
      },
      obtain() {
        if (this.registerForm.phone != '' )
        user.send(this.registerForm.phone).then(()=> {
          this.hasCode = false
          this.num = 60
          this.timing()
        })
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
      success(res,file) {
        if (this.registerForm.avatar != null) {
          this.registerForm.urlList.push(this.registerForm.avatar)
        }
        this.registerForm.avatar = res.data
      },
      beforeAvatarUpload(file){
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
      register(){
        this.$refs.registerForm.validate(v => {
          if (v) {
            user.register(this.registerForm).then(response => {
              const { data } = response
              this.$store.commit('user/SET_TOKEN', data.token)
              this.$store.commit('user/SET_ID', data.id)
              this.$store.commit('user/SET_NAME', data.name)
              this.$store.commit('user/SET_AVATAR', data.avatar)
              this.$store.commit('user/SET_PHONE',data.phone)
              setToken(data.token)
              this.$router.push({ path: this.$route.query.redirect || '/' })
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
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>
