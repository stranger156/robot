<template>
    <div class="page">
        <el-container>
            <el-header style="display: flex; justify-content: center; align-items: center;">
              <el-text style="font-size: xx-large; font-weight: bolder; margin: 0 auto;">
              音频风险检测
              </el-text>
              <el-button type="primary" style="" icon="HomeFilled" @click="gotomenu">回到主页</el-button>
            </el-header>
            <el-main>
                <el-row :gutter="0" class="container">
                    <el-col :span="8" class="grid-container">
                        <el-card class="upload-card" shadow="always" body-style="width:80%; height:90%;">
                            <el-row class="upload-container" style="height: 70%;">
                                <el-upload
                                    class="upload"
                                    ref="fileUpload"
                                    drag
                                    action="#"
                                    :limit="1"
                                    :on-exceed="handleExceed"
                                    :auto-upload="false"
                                    :http-request="uploadFile"
                                    style="margin-bottom: 10%;"
                                >
                                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                    <div class="el-upload__text">
                                    将文件拖拽至此 或 <em>点击上传</em>
                                    </div>
                                    <template #tip>
                                    <div class="el-upload__tip">
                                        只支持上传音频片段
                                    </div>
                                    </template>
                                </el-upload>
                                <el-button type="primary" class="submit-button" @click="handleSubmit">
                                提交
                                </el-button>
                                </el-row>
                              <el-row class="upload-container">
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
                                  title="不是伪造音频"
                                  sub-title="这不是伪造音频"
                                  style="padding: 20px; padding-left: 5px;"
                                >
                                </el-result>
                                <el-result
                                  v-else-if="isRisk==2"
                                  icon="warning"
                                  title="是伪造音频"
                                  sub-title="这是伪造音频，请仔细辨别"
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
                              </el-row>
                        </el-card>
                    </el-col>
                    <el-col :span="8" class="mid-container">
                        <el-row class="container">
                            <el-col class="image-container">
                                <el-card class="fre-card" shadow="always" body-style="width:90%; height:90%;">
                                    <el-row>
                                        <el-col :span="12">
                                            <el-text class="title-text">频谱图</el-text>
                                        </el-col>
                                    </el-row>
                                    <el-row style="height: 80%;">
                                        <el-image style="width: 100%; height: 100%" :src="fre_url" fit="contain" v-loading="isLoading">
                                        </el-image>
                                    </el-row>
                                </el-card>
                            </el-col>
                            <el-col class="image-container">
                                <el-card class="tem-card" shadow="always" body-style="width:90%; height:90%;">
                                    <el-row>
                                        <el-col :span="12">
                                            <el-text class="title-text">波形图</el-text>
                                        </el-col>
                                    </el-row>
                                    <el-row style="height: 80%;">
                                        <el-image style="width: 100%; height: 100%" :src="tem_url" fit="contain" v-loading="isLoading">
                                        </el-image>
                                    </el-row>
                                </el-card>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="8" class="grid-container">
                        <el-card class="output-card" shadow="always" body-style="width:90%; height:95%;">
                            <el-row>
                                <el-col :span="12" style="height: 10%;">
                                    <el-text class="title-text">语音转文字</el-text>
                                </el-col>
                            </el-row>
                            <el-row style="height: 40%; display: flex; justify-content: start; align-content: start; padding-top: 5%;">
                              <el-text v-if="!isLoading">{{ sentence }}</el-text>
                              <div v-else style="color: gray;">等待结果中...</div>
                            </el-row>
                            <el-row>
                                <el-col :span="12" style="height: 10%;">
                                    <el-text class="title-text">词云图</el-text>
                                </el-col>
                            </el-row>
                            <el-row style="height: 50%;">
                            <div ref="cloud" style="height: 100%; width: 100%;" v-loading="isLoading"></div>
                            </el-row>
                        </el-card>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </div>
</template>
<script setup>
// 示例数据
import * as echarts from "echarts"
 
import 'echarts-wordcloud'
 
import { ref,onMounted } from "vue"
import { genFileId } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const fileUpload = ref(null)
const tem_url = ref('')
const fre_url=ref('')
const sentence = ref('这里是语音转文字的结果')
const isLoading = ref(false)
const isRisk = ref(0)
 
 // 词汇数据
 
  const fruits = ref([
    { name: '这里会', value: 500},
    { name: '展示', value: 500 },
    { name: '上传的', value: 500 },
    { name: '音频中', value: 550 },
    { name: '每个', value: 500 },
    { name: '词语的', value: 500 },
    { name: '置信度', value: 600 },
    ]);
const cloud = ref(null)
function initCharts(){
    const chart = echarts.init(cloud.value);
    if (!cloud.value) {
        console.warn("cloud is null or undefined!");
        return;
    }
    chart.setOption({
    series: [{
        type: 'wordCloud',
        shape: 'circle',
        keepAspect: false,     
        left: 'center',
        top: 'center',
        width: '100%',
        height: '100%',
        right: null,
        bottom: null,
        sizeRange: [12, 60],
        rotationRange: [-90, 90],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        shrinkToFit: false,
        layoutAnimation: true,
        textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: function () {
                return 'rgb(' + [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160)
                ].join(',') + ')';
            }
        },
        emphasis: {
            focus: 'self',

            textStyle: {
                textShadowBlur: 10,
                textShadowColor: '#333'
            }
        },
        data: fruits.value
    }]
})
}

const handleExceed = (files) => {
  if (fileUpload.value) {
    fileUpload.value.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    fileUpload.value.handleStart(file)
  }
}

async function handleSubmit() {
  console.log(fileUpload.value)
  fileUpload.value.submit();
}
// 提交文件方法
async function uploadFile(uploadfile) {
  const file =uploadfile.file
  // 获取上传的文件
  if (file==null) {
    alert('请先上传文件再提交！')
    return
  }
  isLoading.value = true
  console.log('上传的文件：', file)

  // 创建 FormData 对象，并添加文件
  const formData = new FormData()
  formData.append('language', 'en')
  formData.append('file', file) // 这里假设后端需要接受字段名为 "file"

  try {
    // 使用 fetch 提交到后端
    const response = await fetch('http://10.16.202.103:5050/api/audio-detection', {
      method: 'POST',
      body: formData
    })

    // 解析服务器返回的数据
    if (response.ok) {
      const responseResult = await response.json()
      const responseData = responseResult.data
      console.log('服务器响应：', responseData)
      // 从响应中处理句子和单词+置信度
      const  words  = responseData.words
      
      isLoading.value = false
      sentence.value = words.map(wordObj => wordObj.word).join(' ')
      const wordData = words.map(wordObj => ({
        name: wordObj.word,
        value: wordObj.conf*100
      }))
      console.log(wordData)
      tem_url.value = 'http://10.16.202.103:5050'+responseData.waveformFilePath
      fre_url.value = 'http://10.16.202.103:5050'+responseData.spectrogramFilePath

      if(responseData.fact=="False")
      {
        isRisk.value = 2
      }
      else if(responseData.fact=="True")
      {
        isRisk.value = 1
      }

      // 根据返回数据更新 UI 或词云图
      if (responseData.words) {
        fruits.value = wordData // 更新词云数据
        initCharts() // 重新渲染词云图
      }

    } else {
      isLoading.value = false
      isRisk.value = 3
      console.error('上传失败！', response.statusText)
      alert('上传失败，请稍后再试！')
    }
  } catch (error) {
    isLoading.value = false
    isRisk.value = 3
    console.error('提交过程出现错误：', error)
    alert('提交失败，请检查网络连接或稍后再试！')
  }
}

const gotomenu=()=>{
  router.push({
    path: '/Menu'
  })
}
 
onMounted(() => {
 
    initCharts()
 
    })
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
.container {
  flex: 1;
  margin: 0;
  width: 100%;
  height: 100%;
}
.grid-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.upload-card {
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  width: 90%;
  height: 90%;
}
.upload-container{
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.upload{
    width: 100%;
    height: 60%;
}
.mid-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50%;
}
.fre-card{
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  width: 90%;
  height: 80%;
}
.tem-card{
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  width: 90%;
  height: 80%;
}
.output-card {
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  width: 90%;
  height: 90%;
}
.title-text{
  font-weight: bolder;
  font-size: large;
}
.upload{
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.submit-button {
  width: 50%;
  
}
</style>