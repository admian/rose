<template>
  <div :class="chartInit.className" :style="{height:chartInit.height,width:chartInit.width}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import { debounce } from '@/utils'

  const animationDuration = 3000

  export default {
    props: ['signData', 'signName'],
    data() {
      return {
        chart: null,
        chartInit: {
          className: 'chart',
          height: '490px',
          width: '100%'
        },
        dataName: null
      }
    },
    watch: {
      signData: {
        handler(newValue, oldValue) {
          this.signData = newValue
          if(this.signName == 'all'){
            this.dataName = '全部作品数'
          }else if(this.signName == '1'){
            this.dataName = '演艺作品数'
          }if(this.signName == '2'){
            this.dataName = '配音作品数'
          }if(this.signName == '3'){
            this.dataName = '即兴作品数'
          }
          this.initChart()
          this.__resizeHandler = debounce(() => {
            if (this.chart) {
              this.chart.resize()
            }
          }, 100)
          window.addEventListener('resize', this.__resizeHandler)
        },
        deep: true
      }
    },
    mounted() {
      if (!this.signData.length) {
        return
      }
      this.initChart()
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      window.removeEventListener('resize', this.__resizeHandler)
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        let xData = []
        let yData = []
        this.signData.map(function(i) {
          xData.push(i.month + '月')
          yData.push(i.count)
        })
        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: xData,
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            //interval:70, y轴间隔
            type: 'value',
            axisTick: {
              show: false
            }
          }],
          series: [{
            name: this.dataName,
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: yData,
            animationDuration
          }]
        })
      }
    }
  }
</script>
