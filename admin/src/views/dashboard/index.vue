<template>
  <div class="dashboard-container">
    <h1 style="margin-left: 42%">数据展示</h1>

    <div id="user" style="width: 100%; min-height: 500px;"></div>
    <div id="order" style="width: 100%; min-height: 500px;"></div>
    <div id="price" style="width: 100%; min-height: 500px;"></div>
  </div>
</template>

<script>
import user from "@/api/user";
import order from "@/api/order";

export default {
  name: 'Dashboard',
  created() {
    this.userReport()
    this.orderReport()
    this.priceReport()
  },
  data(){
    return{
      ux: [],
      uy: [],
      ox: [],
      oy: [],
      px: [],
      py: []
    }
  },
  methods: {
    userReport(){
      user.getReport().then(response => {
        let list = response.data
        for (let i = 0; i < list.length; i++) {
          this.ux.push(list[i].date)
          this.uy.push(list[i].number)
        }
        this.userChart()
      })
    },

    orderReport(){
      order.numberReport().then(response => {
        let list = response.data
        for (let i = 0; i < list.length; i++) {
          this.ox.push(list[i].date)
          this.oy.push(list[i].number)
        }
        this.orderChart()
      })
    },

    priceReport(){
      order.priceReport().then(response => {
        let list = response.data
        for (let i = 0; i < list.length; i++) {
          this.px.push(list[i].date)
          this.py.push(list[i].price)
        }
        this.priceChart()
      })
    },

    userChart() {
      let oChart = this.$echarts.init(document.getElementById("user"));
      let option = {
        title: {
          text: "用户注册情况"
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          show: true,
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: true},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        xAxis: {
          name: '日期',
          type: 'category',
          data: this.ux
        },
        yAxis: {
          name: '数量',
        },
        series: [
          {
            type: "line",
            data: this.uy
          },
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      oChart.setOption(option);
    },
    orderChart() {
      let oChart = this.$echarts.init(document.getElementById("order"));
      let option = {
        title: {
          text: "订单情况"
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          show: true,
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: true},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        xAxis: {
          name: '日期',
          type: 'category',
          data: this.ox
        },
        yAxis: {
          name: '数量',
        },
        series: [
          {
            type: "line",
            data: this.oy
          },
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      oChart.setOption(option);
    },
    priceChart() {
      let oChart = this.$echarts.init(document.getElementById("price"));
      let option = {
        title: {
          text: "销售情况"
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          show: true,
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: true},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        xAxis: {
          name: '日期',
          type: 'category',
          data: this.px
        },
        yAxis: {
          name: '金额',
        },
        series: [
          {
            type: "line",
            data: this.py
          },
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      oChart.setOption(option);
    },
  },

  computed: {
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
</style>
