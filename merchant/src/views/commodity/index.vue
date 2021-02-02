<template>
  <div>
    <el-row>
      <el-button style="margin:25px 82%;font-size: 25px" type="text" @click="showCCreate">添加水果</el-button>
    </el-row>
    <el-row>
      <el-table
        :data="lists"
        style="width: 70%; margin-left: 15%">
        <el-table-column prop="id" label="商品id" width="70">
        </el-table-column>
        <el-table-column prop="cname" label="商品名称" width="120">
        </el-table-column>
        <el-table-column prop="vname" label="所属种类" width="80">
        </el-table-column>
        <el-table-column label="图片" width="150">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.urlList[0]"
              :preview-src-list="scope.row.urlList">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="150">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.isOnShelf">
              <el-button type="text" @click="off(scope.row.id)">下架</el-button>
              <div style="width: 160px; font-size: 8px; color: #909399">其他操作需下架商品才能操作</div>
            </div>
            <div v-else>
              <el-button type="text" @click="up(scope.row.id)">上架</el-button>
              <el-button type="text" @click="deleteCommodity(scope.row.id)">删除</el-button>
              <el-button type="text" @click="showEditCommodity(scope.row.id)">修改</el-button>
              <el-button type="text" @click="showInfo(scope.row.id)">查看规格</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        style="margin: 20px 40%"
        :current-page="cur"
        @current-change="init"
        background
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </el-row>

    <el-dialog title="商品规格" :visible.sync="infoVisible">
      <el-table :data="list">
        <el-table-column property="specification" label="规格" width="140"></el-table-column>
        <el-table-column property="weight" label="重量" width="80"></el-table-column>
        <el-table-column property="stock" label="库存" width="80"></el-table-column>
        <el-table-column property="price" label="价格" width="80"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="sc">
            <el-button type="text" @click="infoUpdate(sc.row.id)">修改</el-button>
            <el-button type="text" @click="infoDelete(sc.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="margin-left: 80%" type="primary" @click="addInfo">添加规格</el-button>
    </el-dialog>

    <el-dialog :title="infoTitle" :visible.sync="editInfoVisible" width="30%">
      <el-form :model="info" ref="info" label-width="80px" style="width: 260px; margin-left: 15%"
               :rules="iRules">
        <el-form-item label="规格" prop="specification">
          <el-input v-model="info.specification" style="width: 160px" placeholder="请填写规格"></el-input>
        </el-form-item>
        <el-form-item label="重量(kg)" prop="weight">
          <el-input v-model="info.weight" style="width: 160px" placeholder="请填写重量单位（kg)"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model.number="info.stock" style="width: 160px" placeholder="请填写库存"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price">
          <el-input v-model="info.price" style="width: 160px" placeholder="请填写价格单位(元)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 20%" v-if="info.id" type="success" @click="infoEdit('info')">修改</el-button>
          <el-button style="margin-left: 20%" v-else type="primary" @click="infoCreate('info')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="showCEdit" style="width: 80%; margin-left: 15%">
      <el-form :model="commodity" label-width="80px" ref="commodity" :rules="cRules">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="commodity.name" style="width: 200px" placeholder="请填写水果名称"></el-input>
        </el-form-item>
        <el-form-item label="所属种类" prop="varietyId">
          <el-select ref="editSelect"
                     v-model="commodity.varietyId"
                     filterable
                     allow-create
                     default-first-option
                     @change="vChange"
                     placeholder="请选择">
            <el-option
              v-for="item in variety"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="urlList">
          <el-upload
            class="upload-demo"
            action="http://localhost:8002/fruit-mall/oss/upload"
            :on-success="success"
            :on-remove="remove"
            :file-list="fileList"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left: 35%" v-if="commodity.id" type="primary" size="small"
                     @click="edit('commodity')">修改
          </el-button>
          <el-button style="margin-left: 35%" v-else type="success" size="small" @click="create('commodity')">添加
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import commodity from "@/api/commodity";

  export default {
    name: "index",
    created() {
      this.init()
      this.getVariety()
      this.info.shopId = this.shop_id
    },
    computed: {
      ...mapGetters([
        'shop_id'
      ])
    },
    data() {
      return {
        cur: 1,
        total: 10,
        lists: [],
        list: [],
        infoVisible: false,
        commodity: {
          urlList: [],
          removeList: [],
        },
        showCEdit: false,
        variety: [],
        fileList: [],
        title: '',
        infoTitle: '',
        editInfoVisible: false,
        info: {},
        cRules: {
          name: [
            {required: true, message: '水果名不能为空', trigger: 'blur'}
          ],
          varietyId: [
            {required: true, message: '请为水果选择所属种类', trigger: 'blur'}
          ],
          urlList: [
            {required: true, message: '请为水果上传图片', trigger: 'blur'}
          ]
        },
        iRules: {
          specification: [
            {required: true, message: '规格不能为空', trigger: 'blur'}
          ],
          weight: [
            {required: true, message: '重量不能为空', trigger: 'blur'},
          ],
          stock: [
            {type: 'number', message: '库存必须为数字', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '必须填写金额', trigger: 'blur'},
          ]
        },
        commodityId: 0,
      }
    },
    methods: {
      init() {
        commodity.getCommodityList(this.shop_id, this.cur).then(response => {
          this.lists = response.data.data
          this.total = response.data.total
        })
      },
      showInfo(id) {
        this.commodityId = id
        commodity.getInfoList(id).then(response => {
          this.list = response.data
          this.infoVisible = true
        })
      },
      off(id) {
        commodity.off(id).then(() => {
          this.init()
        })
      },
      up(id) {
        commodity.up(id).then(() => {
          this.init()
        })
      },
      deleteCommodity(id) {
        commodity.deleteCommodity(id).then(() => {
          this.init()
        })
      },
      showEditCommodity(id) {
        this.fileList = []
        this.title = '修改水果信息'
        commodity.getInfo(id).then(response => {
          this.commodity = response.data
          this.showCEdit = true
          for (let i = 0; i < this.commodity.urlList.length; i++) {
            this.fileList.push({name: '', url: this.commodity.urlList[i]})
          }
          this.commodity.removeList = []
        })
      },
      getVariety() {
        commodity.getVariety().then(response => {
          this.variety = response.data
        })
      },
      success(res, file) {
        this.commodity.urlList.push(res.data)
      },
      remove(file) {
        this.commodity.removeList.push(file.response.data)
      },
      showCCreate() {
        this.showCEdit = true
        this.title = '添加水果信息'
        this.commodity = {
          urlList: [],
          removeList: [],
        }
        this.fileList = []
      },
      edit(valid) {
        this.$refs[valid].validate(v => {
          if (v) {
            commodity.update(this.commodity).then(() => {
              this.showCEdit = false
            })
          } else {
            return false
          }
        })
      },
      create(valid) {
        console.log(this.commodity)
        this.$refs[valid].validate(v => {
          if (v) {
            this.commodity.shopId = this.shop_id
            commodity.create(this.commodity).then(() => {
              this.showCEdit = false
              this.init()
            })
          } else {
            return false
          }
        })
      },
      addInfo() {
        this.editInfoVisible = true
        this.infoTitle = '添加商品规格'
        this.info = {
          commodityId: this.commodityId,
          shopId: this.shop_id
        }
      },
      infoUpdate(id) {
        this.infoTitle = '修改商品规格'
        commodity.infoGet(id).then(response => {
          this.info = response.data
          this.editInfoVisible = true
        })
      },
      infoDelete(id) {
        commodity.infoDelete(id).then(() => {
          this.showInfo(this.info.commodityId)
        })
      },
      infoEdit(valid) {
        this.$refs[valid].validate(v => {
          if (v) {
            commodity.infoEdit(this.info).then(() => {
              this.showInfo(this.info.commodityId)
              this.editInfoVisible = false
            })
          } else {
            return false
          }
        })
      },
      infoCreate(valid) {
        this.$refs[valid].validate(v => {
          if (v) {
            commodity.infoCreate(this.info).then(() => {
              this.showInfo(this.info.commodityId)
              this.editInfoVisible = false
            })
          } else {
            return false
          }
        })
      },
      vChange(val) {
        if (val.constructor == String) {
           commodity.insertVariety(val).then(res => {
             let id = res.data
             commodity.getVariety().then(response => {
               this.variety = response.data
               setTimeout(()=>{
                 this.commodity.varietyId = id
               }, 1000)
             })
           })
        }
      }
    },
  }
</script>

<style scoped>

</style>
