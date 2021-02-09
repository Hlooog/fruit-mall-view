<template>
  <div>
    <h3 v-if="userName" style="text-align: center;color: #acecff">与{{userName}}对话</h3>

    <el-row style="margin-left:15%;
    height: 500px;
    width: 800px;
    border: 1px solid khaki;
    border-radius: 2%">
      <el-col :span="18">
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
                  <el-row v-if="c.fromPhone != 'service'">
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
                      style="width: 500px; height: 120px"
                      :rows="5"
                      v-model="message.content"
                      :disabled="!message.toPhone"
                      maxlength="255">
            </el-input>

            <el-button style="position:absolute;
            right:10px; bottom: 0px" type="text" @click="submit">发送
            </el-button>
          </div>
        </el-row>
      </el-col>
      <el-col :span="6">
        <div class="box" style="height: 380px">
          <el-scrollbar style="height: 100%">
            <ul class="cotrs">
              <li v-for="(u, index) in link"
                  :key="index"
                  @click="click(u)"
                  :class="{active : select == u.name}">
                <el-row>
                  <el-col :span="2">
                    <el-badge v-if="unread[u.phone]" v-model="unread[u.phone]" class="item">
                      <el-avatar :src="u.avatar"></el-avatar>
                    </el-badge>
                    <el-avatar v-else :src="u.avatar"></el-avatar>
                  </el-col>
                  <el-col :span="6" style="margin-left: 17%;margin-top: 14px">
                    {{u.name}}
                  </el-col>
                </el-row>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import service from "@/api/service";

  export default {
    name: "index",
    created() {
      this.toBottom()
      this.message.fromPhone = 'service'
      this.message.fromName = '客服'
      this.message.avatar = this.avatar
      this.initWebsocket()
      this.initUser()
    },
    data() {
      return {
        userName: '',
        chatList: [],
        bar: {},
        isFixedTop: false,
        select: '',
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
        unread: {},
        link: [],
        cur: 1,
        hasNext: false,
        m: '4',
      }
    },
    methods: {
      initWebsocket() {
        const url = "ws://localhost:8080/fruit-mall/chat/service"
        this.ws = new WebSocket(url)
        this.ws.open = this.onOpen
        this.ws.onmessage = this.onMessage
        this.ws.onerror = this.onError
        // this.ws.close = this.onClose
      },
      initUser() {
        service.getLinkUser().then(response => {
          this.link = response.data.link
          let keys = Object.keys(response.data.unread)
          for (let i = 0; i < keys.length; i++) {
            this.$set(this.unread, keys[i], response.data.unread[keys[i]])
          }
        })
      },

      onOpen() {
      },

      send(data) {
        this.ws.send(data)
      },

      onMessage(e) {
        let data = e.data
        let m = JSON.parse(data)
        if (m.name) {
          let index = this.getIndex(m.phone)
          if (index != 0) {
            if (index != -1) {
              this.link.splice(index, 1)
            }
            this.link.unshift(m)
          }
        } else {
          if (m.fromPhone != this.message.toPhone) {
            if (this.unread[m.fromPhone]) {
              this.unread[m.fromPhone]++
            } else {
              this.$set(this.unread, m.fromPhone, 0)
              this.unread[m.fromPhone]++
            }
          } else {
            this.chatList.push(m)
            this.toBottom()
          }
        }
      },

      getIndex(phone) {
        for (let i = 0; i < this.link.length; i++) {
          if (phone == this.link[i].phone) {
            return i;
          }
        }
        return -1;
      },

      onError() {
        setTimeout(() => {
          this.time = this.time * 2
          this.initWebsocket()
        }, this.time)
      },

      onClose() {
        console.log("websocket close")
      },

      submit() {
        if (this.message.content.trim() != '') {
          let now = new Date()
          this.message.id = now.getTime()
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
              service.gerRecord(this.message.toPhone, this.cur).then(response => {
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
      click(u) {
        let index = this.getIndex(u.phone)
        this.link.splice(index, 1)
        this.link.unshift(u)
        this.userName = u.name
        this.select = u.name
        this.chatList = []
        this.message.toPhone = u.phone
        this.message.toName = u.name
        this.cur = 1
        service.gerRecord(u.phone, this.cur).then(response => {
          this.chatList = response.data
          this.unread[u.phone] = 0
          this.$nextTick(() => {
            this.bar.scrollTop = this.bar.scrollHeight
          })
        })
      }
    },
    mounted() {
      this.load()
      this.ws.onmessage
      this.ws.onerror
    },
    computed: {
      ...mapGetters([
        'phone',
        'name',
        'avatar',
      ])
    },
    destroyed() {
      this.ws.close()
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

  .active {
    background: #fd7522;
    border: 1px solid #fd7522;
    color: #fff;
    border-radius: 5px;
  }

</style>
