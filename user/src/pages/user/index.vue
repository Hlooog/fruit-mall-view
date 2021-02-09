<template>
  <div>
    <ul style="width: 250px; margin: 50px auto">
      <li>
        <el-upload
          style="margin-left: 30px;"
          class="avatar-uploader"
          action="http://localhost:8003/fruit-mall/oss/upload"
          :show-file-list="false"
          :on-success="success"
          :before-upload="beforeAvatarUpload">
          <el-avatar v-if="avatar" :src="avatar" class="avatar"/>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </li>
      <li class="inputli">
        <el-input :disabled="edit" style="font-size: 30px" @change="nameChange"
                  v-model="name" @click.native="editName" @blur="edit = true"></el-input>
      </li>
      <li>
        <el-button type="text" style="font-size: 20px;margin-left: 80px " @click="getAddress">收货地址管理</el-button>
      </li>
      <li>
        <el-button type="text" style="font-size: 20px;margin-left: 80px " @click="editVisible = true">修改密码</el-button>
      </li>
      <li>
        <el-button type="text" style="font-size: 20px;margin-left: 80px" @click="logoutVisible = true">注销账号</el-button>
      </li>
    </ul>

    <el-dialog
      title="修改密码"
      :visible.sync="editVisible"
      width="30%">
      <el-form :model="pwd" ref="pwd" label-width="100px" :rules="editRule">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="pwd.phone" style="width: 220px" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="pwd.password" style="width: 220px" placeholder="请输入新密码" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input v-model="pwd.password2" style="width: 220px" placeholder="确认密码" show-password></el-input>
        </el-form-item>
        <el-form-item prop="code" label="验证码">
          <el-input style="width: 160px" v-model="pwd.code" placeholder="请先获取验证码"></el-input>
          <el-button v-if="hasCode" type="text" @click="obtain">获取验证码</el-button>
          <span v-else style="color: #20a0ff">{{num}} 秒</span>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" style="margin-left: 25%" @click="editPassword">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="注销账户"
      :visible.sync="logoutVisible"
      width="30%">
      <el-form :model="logout" ref="logout" label-width="100px" :rules="editRule">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="logout.phone" style="width: 220px" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="验证码">
          <el-input style="width: 160px" v-model="logout.code" placeholder="请先获取验证码"></el-input>
          <el-button v-if="hasCode" type="text" @click="obtain">获取验证码</el-button>
          <span v-else style="color: #20a0ff">{{num}} 秒</span>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" style="margin-left: 25%" @click="deleteAccount">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="收货地址"
      :visible.sync="addressVisible"
      width="50%">
      <el-table :data="addressList">
        <el-table-column label="姓名" prop="name" width="100"></el-table-column>
        <el-table-column label="电话" prop="phone" width="140"></el-table-column>
        <el-table-column label="收货地址" prop="address" width="250"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="delAddress(scope.row.id)">删除</el-button>
            <el-button type="text" @click="editAddress(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" style="margin: 15px 80%" @click="addAddress">新增地址</el-button>
    </el-dialog>

    <el-dialog
      title="收货地址"
      :visible.sync="editAddressVisible"
      width="30%">
      <el-form :model="address" label-width="120px" ref="address" :rules="addressRule">
        <el-form-item label="收货人姓名" prop="name">
          <el-input v-model="address.name" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话" prop="phone">
          <el-input v-model="address.phone" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item label="收货人地址" prop="address">
          <el-input v-model="address.address" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="address.id" type="primary" @click="editSubmit">修改</el-button>
          <el-button v-else type="primary" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import user from "../../api/user";
  import {removeToken} from "../../utils/auth";
  import {resetRouter} from "../../router";
  import md5 from 'js-md5'

  export default {
    name: "index",
    created() {
      this.getInfo()
    },
    data() {
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.pwd.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        name: '',
        avatar: '',
        edit: true,
        pwd: {
          phone: '',
          password: '',
          password2: '',
          code: '',
        },
        num: 60,
        hasCode: true,
        editRule: {
          phone: [
            {required: true, message: '手机号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          password2: [
            {validator: validatePass2, trigger: 'blur'}
          ],
          code: [
            {required: true, message: '验证码不能为空', trigger: 'blur'}
          ]
        },
        editVisible: false,
        logoutVisible: false,
        logout: {
          phone: '',
          code: '',
        },
        addressVisible: false,
        editAddressVisible: false,
        addressList: [],
        address: {},
        addressRule: {
          name: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '手机号码不能为空', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '收获地址不能为空', trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      getInfo() {
        user.getInfo().then(response => {
          this.avatar = response.data.avatar
          this.name = response.data.name
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
      success(res) {
        this.avatar = res.data
        let map = {
          avatar: this.avatar
        }
        user.edit(map)
      },
      editName() {
        this.edit = false
      },
      nameChange() {
        let map = {
          name: this.name
        }
        user.edit(map).then(() => {
          this.edit = true
        })
      },
      obtain() {
        this.num = 60
        if (this.phone) {
          user.sendMsg(this.phone).then(() => {
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
      editPassword() {
        this.$refs.pwd.validate(v => {
          if (v) {
            let password = md5(this.pwd.password)
            let map = {
              phone: this.pwd.phone,
              password: password,
              code: this.pwd.code
            }
            user.edit(map).then(() => {
              removeToken() // must remove  token  first
              resetRouter()
              this.$store.commit('user/RESET_STATE')
              this.$router.push("/login?redirect=" + this.$router.currentRoute.fullPath)
            })
          } else {
            return false
          }
        })
      },
      deleteAccount() {
        let map = {
          phone: this.logout.phone,
          code: this.logout.code
        }
        user.deleteAccount(map).then(() => {
          this.$message({
            type: 'success',
            message: '注销账户成功',
          })
          removeToken() // must remove  token  first
          resetRouter()
          this.$store.commit('user/RESET_STATE')
          this.$router.push("/login?redirect=" + this.$router.currentRoute.fullPath)
        })
      },
      getAddress() {
        user.getAddressList().then(response => {
          this.addressList = response.data
          this.addressVisible = true
        })
      },
      delAddress(id) {
        user.delAddress(id).then(() => {
          let index = 0
          for (let i = 0; i < this.addressList.length; i++) {
            if (id === this.addressList[i].id) {
              index = i
              break
            }
          }
          this.addressList.splice(index,1)
        })
      },
      editAddress(data) {
        this.address = data
        this.editAddressVisible = true
      },
      addAddress() {
        this.address = {}
        this.editAddressVisible = true
      },
      editSubmit() {
        this.$refs.address.validate(v => {
          if (v) {
            user.updateAddress(this.address).then(() => {
              this.editAddressVisible = false
            })
          } else {
            return false
          }
        })
      },
      add() {
        this.$refs.address.validate(v => {
          if (v) {
            user.addAddress(this.address).then(response  => {
              this.editAddressVisible = false
              let address = {
                id: response.data,
                name: this.address.name,
                phone: this.address.phone,
                address: this.address.address
              }
              this.addressList.push(address)
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
  ul li {
    list-style: none;
  }

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

  .inputli >>> .el-input__inner {
    border: 0;
    vertical-align: middle;
    text-align: center;
    background: white
  }
</style>
