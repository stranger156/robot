<template>
  <div class="page">
    <el-container>
      <el-header style="display: flex; justify-content: center; align-content: end;"><el-text style="font-size: xx-large; font-weight: bolder;">文本风险检测</el-text></el-header>
      <el-container>
        <el-main>
          <!-- 网格布局 -->
          <el-row :gutter="0" class="grid-container">
            <!-- 左上角：带输入和按钮 -->
            <el-col :span="12" class="grid-col">
              <el-card shadow="always" class="grid-item" body-class="card-content" body-style="width:80%; height:80%;">
                <div class="card-content">
                  <el-input
                  v-model="inputText"
                  placeholder="请输入内容..."
                  class="text-input"
                  height="80%"
                />
                <el-button type="primary" class="submit-button" @click="submit">
                  提交
                </el-button>
                </div>
              </el-card>
            </el-col>

            <el-col :span="12" class="grid-col">
              <el-card shadow="always" class="grid-item" body-class="result-container" body-style="width:90%; height:90%;">
                <el-row>
                  <el-col :span="12">
                    <el-text class="title-text">结果展示</el-text>
                  </el-col>
                </el-row>
                <el-row style="height: 80%;">
                  <el-col :span="12" style="border-right:  solid 1px #CDD0D6;" v-loading="isLoading">
                    <el-result
                      v-if="isRisk==0"
                      icon="primary"
                      title="这是结果"
                      sub-title="这里会展现系统判断的结果"
                      style="padding: 20px; padding-left: 5px;"
                    >
                    </el-result>
                    <el-result
                      v-else-if="isRisk==1"
                      icon="success"
                      title="不是诈骗短信"
                      sub-title="这不是诈骗文本"
                      style="padding: 20px; padding-left: 5px;"
                    >
                    </el-result>
                    <el-result
                      v-else-if="isRisk==2"
                      icon="warning"
                      title="是诈骗短信"
                      sub-title="这是诈骗短信，请仔细辨别"
                      style="padding: 20px; padding-left: 5px;"
                    >
                    </el-result>
                    <el-result
                      v-else-if="isRisk==3"
                      icon="error"
                      title="出错了"
                      sub-title="出错啦！请重试"
                      style="padding: 20px; padding-left: 5px;"
                    >
                    </el-result>
                    </el-col>
                  <el-col :span="12">
                    <v-chart :option="gaugeOption" style="width: 100%; height: 100%;" />
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
          <el-row class="grid-container">
            <el-col class="grid-reason">
              <el-card shadow="always" class="card-reason" body-class="reason-container" body-style="width:90%; height:90%;">
              <el-row style="height: 100%;">
                <el-col :span="8" class="reason-text" style="width: 30%;">
                  <el-text class="title-text">风险原因</el-text><br>
                  <div style="margin-top: 5%; margin-right: 10%;height: 80%;border-right: solid 1px #CDD0D6;">
                    <el-text v-if="!isLoading" v-html="reasons"></el-text>
                    <el-skeleton v-else :rows="4" animated />
                  </div>
                </el-col>
                <el-col :span="16" class="reason-text" style="width: 70%;">
                  <el-text class="title-text">统计图</el-text><br>
                  <v-chart :option="chartOption" style="width: 100%; height: 100%;" v-loading="isLoading"/>
                </el-col>
              </el-row>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
        <el-aside width="33vw">
          <el-row class="grid-container large-container">
            <el-col class="large-col">
              <el-card shadow="always" class="grid-item large-card" body-style="width:90%; height:95%;">
                <el-text class="title-text">高危词语展示</el-text><br>
                <div v-if="!isLoading" v-html="highlightedText" style="margin-top: 10%;"></div>
                <div v-else style="margin-top: 10%; color: gray;">等待结果中...</div>
              </el-card>
            </el-col>
          </el-row>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>



<script setup>
import { ref, computed, reactive } from 'vue'
import axios from 'axios' // 引入 axios 发送 HTTP 请求
import { ElMessage } from 'element-plus' // 使用 Element Plus 的提示信息组件
import { use } from 'echarts/core'
import { GaugeChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { graphic } from 'echarts'

use([TitleComponent, TooltipComponent, GaugeChart, CanvasRenderer, BarChart])


const inputText = ref('')
const url = 'http://10.16.203.7:5000'
const similarityRate = ref(0)
const reasons = ref('❗️这里会展示文本具有风险的原因')
const key_word_num = ref({
  "这里会":1,
  "展示":1,
  "高危词语频次":1
})
const highlightedText = ref('这里会高亮您上传文本中的<span style="color: red;">高危词语</span>')
const keyWords = ref([])
const isLoading = ref(false)
const isRisk = ref(0)


// 计算属性，用于处理高亮显示的文本
function generateHighlightedText() {
  let text = inputText.value
  let keyWordValue = keyWords.value

  keyWordValue.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi')
    text = text.replace(regex, '<span style="color: red;">$1</span>')
  })

  highlightedText.value = text
}


async function submit() {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入内容后再提交')
    return
  }
  isLoading.value = true
  try {
    // 第一个接口：上传内容
    const formData = new FormData()
    formData.append('text', inputText.value)
    formData.append('Api_key', 'sk-e0c04983f70041ddbfb0051917c13ed5')

    // 第一个接口：上传内容
    const firstResponse = await axios.post(url + '/upload_text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    const uploadedText = firstResponse.data.text
    ElMessage.success(firstResponse.data.msg)

    // 第二个接口：提交分析
    const secondResponse = await axios.post(url+'/bad_info_detect', {
      
    })

    const result = secondResponse.data.predict_results
    console.log('检测结果：', result)
    reasons.value = result.reasons.map(r => `❗️${r}`).join('<br>')
    keyWords.value = result.key_word
    key_word_num.value = result.key_word_num
    similarityRate.value = result.similarity_rate[0]
    if(result.is_risk)
    {
      isRisk.value = 2
    }
    else{
      isRisk.value = 1
    }

    isLoading.value = false

    generateHighlightedText()

    console.log(reasons.value)
    console.log(keyWords.value)
    console.log(key_word_num.value)
    
  } catch (error) {
    console.error('请求出错：', error)
    isRisk.value = 3
    ElMessage.error('请求失败，请稍后重试')
  } finally{
    isLoading.value = false
  }
}

const gaugeOption = computed(() => ({
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%'
  },
  series: [
    {
      type: 'gauge',
      startAngle: 160,
      endAngle: 20,
      center: ['50%', '75%'],
      radius: '90%',
      min: 0,
      max: 1,
      splitNumber: 8,
      axisLine: {
        lineStyle: {
          width: 6,
          color: [
            [0.3, '#91cc75'],   // 绿色：低风险
            [0.7, '#fac858'],   // 黄色：中风险
            [1, '#ee6666'] 
          ]
        }
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '12%',
        width: 10,
        offsetCenter: [0, '-60%'],
        itemStyle: {
          color: 'auto'
        }
      },
      axisTick: {
        length: 12,
        lineStyle: {
          color: 'auto',
          width: 2
        },
        show:false
      },
      splitLine: {
        length: 10,
        lineStyle: {
          color: 'auto',
          width: 3
        }
      },
      axisLabel: {
        color: '#464646',
        fontSize: 15,
        distance: -30,
        rotate: 'tangential',
        formatter: function (value) {
          if (value === 0.875) {
            return '高';
          } else if (value === 0.5) {
            return '中';
          } else if (value === 0.125) {
            return '低';
          }
          return '';
        }
      },
      title: {
        offsetCenter: [0, '0%'],
        fontSize: 20
      },
      detail: {
        fontSize: 20,
        offsetCenter: [0, '-35%'],
        valueAnimation: true,
        formatter: function (value) {
          return Math.round(value * 100) + '%';
        },
        color: 'inherit'
      },
      data: [
        {
          value: similarityRate.value,
          name: '风险概率'
        }
      ]
    }
  ]
}))

// 获取最大值，用于计算宽度比例


// 根据数据的数量来动态调整宽度
const barWidth = 100 / Object.keys(key_word_num.value).length;

const chartOption = computed(() => ({
  xAxis: {
    type: 'category',
    data: Object.keys(key_word_num.value), // x 坐标为 key_word_num 的键
    axisLabel: {
      interval: 0, // 保证所有标签都显示
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: Object.values(key_word_num.value),  // y 坐标为 key_word_num 的值
      type: 'bar',
      itemStyle: {
        // 设置柱子的渐变蓝色
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#1e90ff' },  // 起始颜色
          { offset: 1, color: '#00bfff' }  // 结束颜色
        ])
      },
      // 动态调整柱子宽度
      barWidth: barWidth + '%',
      label: {
        show: true,
        position: 'top', // 标签显示在柱子顶部
        color: '#333',
        fontSize: 12
      }
    }
  ]
}))
</script>

<style scoped>
.page{
  width: 100vw;
  height: 100vh;
  background: #f0f2f5;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.grid-container {
  flex: 1;
  margin: 0;
  width: 100%;
  height: 50%;
}

.grid-col {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.grid-reason{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.card-reason{
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  width: 95%;
  height: 80%;
}

.grid-item {
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  width: 90%;
  height: 80%;
}

.large-container {
  flex: 1;
  margin: 0;
  width: 100%;
  height: 100%;
}

.large-col{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.large-card {
  height: 85%;
  width: 80%;
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.text-input {
  width: 100%;
  height: 100%;
  margin-bottom: 16px;
  flex:1;
}

.submit-button {
  width: 50%;
  
}

.result-container{
  width: 80%;
  height: 80%;
}

.reason-container{
  width: 90%;
  height: 80%;
}

.title-text{
  font-weight: bolder;
  font-size: large;
}
</style>