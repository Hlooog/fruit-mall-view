<template>
  <div>
    <h2 style="text-align: center;color: #acecff">与客服对话</h2>
    <el-row style="margin-left:20%;
    height: 500px;
    width: 800px;
    border: 1px solid khaki;
    border-radius: 2%">
      <el-col :span="24">
        <el-row style="height: 380px;
        border-width: 0 1px 1px 0;
        border-color: khaki;
        border-style: solid">
          <div class="box" style="height: 380px">
            <el-scrollbar style="height: 100%;"
                          ref="scrollbar">
              <p v-if="isFixedTop" style="position:fixed;margin-left: 23%" class="el-icon-loading"></p>
              <p v-if="hasNext" style="position:fixed;margin-left: 23%">没有更多信息了</p>
              <ul style="overflow:auto">
                <li v-for="(c,index) in chatList" :key="index" style="min-height:40px; overflow: auto">
                  <el-row v-if="c.fromPhone != phone">
                    <el-col :span="2">
                      <el-avatar :src="c.avatar"></el-avatar>
                    </el-col>
                    <el-col :span="22">
                      <span class="left">{{c.content}}</span>
                    </el-col>
                  </el-row>
                  <el-row v-else>
                    <el-col :span="22">
                      <span class="right">{{c.content}}</span>
                    </el-col>
                    <el-col :span="2">
                      <el-avatar :src="c.avatar"></el-avatar>
                    </el-col>
                  </el-row>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </el-row>
        <el-row style="height: 120px;
          border-width: 0 1px 0 0;
          border-style: solid;
          border-color: khaki">
          <div>
            <el-input type="textarea"
                      style="width: 700px; height: 120px"
                      :rows="5"
                      v-model="message.content"
                      maxlength="255">
            </el-input>

            <el-button style="position:absolute;
            right:10px; bottom: 0px" type="text" @click="submit">发送
            </el-button>
          </div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import service from "../../../../admin/src/api/service";

  export default {
    name: "index",

    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (!vm.$store.getters.id) {
          vm.$router.push('/login?redirect=' + vm.$router.currentRoute.fullPath)
        }
      })
    },

    created() {
      this.toBottom()
      this.message.fromPhone = this.phone
      this.message.fromName = this.name
      this.message.avatar = this.avatar
      this.message.toPhone = 'service'
      this.message.toName = '客服'
      this.initWebsocket()
      this.initRecord()
    },
    data() {
      return {
        chatList: [],
        bar: {},
        isFixedTop: false,
        ws: null,
        message: {
          id: 0,
          fromPhone: '',
          fromName: '',
          avatar: '',
          toPhone: '',
          toName: '',
          content: '',
        },
        time: 1000,
        cur: 1,
        hasNext: false
      }
    },
    methods: {
      initWebsocket() {
        const url = "ws://localhost:8080/fruit-mall/chat/" + this.phone
        this.ws = new WebSocket(url)
        this.ws.open = this.onOpen
        this.ws.onmessage = this.onMessage
        this.ws.onerror = this.onError
        this.ws.onclose = this.onClose
      },

      initRecord() {
        this.chatList = []
        this.cur = 1
        service.gerRecord(this.phone, this.cur).then(response => {
          this.chatList = response.data
          this.toBottom()
        })
      },

      onOpen() {
      },

      send(data) {
        this.ws.send(data)
      },

      onMessage(e) {
        let m = JSON.parse(e.data)
        this.chatList.push(m)
        this.toBottom()
      },

      onError() {
        setTimeout(() => {
          this.time = this.time * 2
          this.initWebsocket()
        }, this.time)
      },

      onClose() {
        console.log("websocket close ")
      },

      submit() {
        if (this.message.content.trim() != '') {
          this.message.id = new Date().getTime()
          let data = this.messageToData()
          this.message.content = ''
          this.chatList.push(data)
          this.send(JSON.stringify(data))
          this.toBottom()
        }
      },
      messageToData() {
        let data = {
          id: this.message.id,
          fromPhone: this.message.fromPhone,
          fromName: this.message.fromName,
          avatar: this.message.avatar,
          toPhone: this.message.toPhone,
          toName: this.message.toName,
          content: this.message.content,
        }
        return data
      },
      toBottom() {
        this.$nextTick(() => {
          this.bar.scrollTop = this.bar.scrollHeight
        })
      },
      load() {
        this.bar = this.$refs.scrollbar.wrap
        let height = this.bar.scrollHeight
        this.bar.onscroll = () => {
          if (this.bar.scrollTop == 0) {
            if (this.cur != 0) {
              this.isFixedTop = true
              this.cur = this.cur + 1
              service.gerRecord(this.phone, this.cur).then(response => {
                if (response.data.length > 0) {
                  this.chatList = [...response.data, ...this.chatList]
                  this.isFixedTop = false
                  this.bar.scrollTop = this.bar.scrollHeight - height
                } else {
                  this.cur = 0;
                  this.isFixedTop = false
                  this.hasNext = true
                  setTimeout(() => {
                    this.hasNext = false
                  }, 1000)
                }
              })
            } else {
              this.hasNext = true
              setTimeout(() => {
                this.hasNext = false
              }, 1000)
            }
          }
        }
      },
    },
    mounted() {
      this.load()
      this.onMessage
      this.onError
    },
    computed: {
      ...mapGetters([
        'phone',
        'name',
        'avatar',
      ])
    },
    destroyed() {
      this.ws.onclose = this.onClose
    }
  }
</script>


<style>
  .left {
    float: left;
    width: auto;
    height: auto;
    max-width: 240px;
    background-color: skyblue;
    border-bottom-color: skyblue;
    margin-top: 1%;
    margin-left: 1%;
    /*为了给after伪元素自动继承*/
    color: #fff;
    font-size: 15px;
    line-height: 18px;
    padding: 5px 12px 5px 12px;
    box-sizing: border-box;
    border-radius: 6px;
    position: relative;
    word-break: break-all;
  }

  .right {
    float: right;
    width: auto;
    height: auto;
    max-width: 240px;
    background-color: skyblue;
    border-bottom-color: skyblue;
    margin-right: 15px;
    margin-top: 5px;
    /*为了给after伪元素自动继承*/
    color: #fff;
    font-size: 15px;
    line-height: 18px;
    padding: 5px 12px 5px 12px;
    box-sizing: border-box;
    border-radius: 6px;
    position: relative;
    word-break: break-all;
  }

  .right::after {
    content: '';
    position: absolute;
    top: 70%;
    right: -5px;
    width: 10px;
    height: 10px;
    margin-top: -10px;
    background: inherit;
    /*自动继承父元素的背景*/
    transform: rotate(45deg);
  }

  /** 通过对小正方形旋转45度解决 **/
  .left::before {
    content: '';
    position: absolute;
    top: 70%;
    left: -5px;
    width: 10px;
    height: 10px;
    margin-top: -10px;
    background: inherit;
    /*自动继承父元素的背景*/
    transform: rotate(45deg);
  }

  li {
    list-style-type: none;
  }

  .box .el-scrollbar__wrap {
    overflow-x: hidden;
  }

</style>
