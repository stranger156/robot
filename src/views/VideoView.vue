<template>
    <div class="page">
        <el-container>
            <el-header style="display: flex; justify-content: center; align-content: end;">
              <el-text style="font-size: xx-large; font-weight: bolder;">
              音频风险检测
              </el-text>
            </el-header>
            <el-main>
                <el-row :gutter="0" class="container">
                    <el-col :span="8" class="grid-container">
                        <el-card class="upload-card" shadow="always" body-style="width:80%; height:90%;">
                            <el-row>
                              <el-col class="upload-container">
                                <el-upload
                                    class="upload"
                                    ref="fileUpload"
                                    drag
                                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                                    :limit="1"
                                    :on-exceed="handleExceed"
                                    :auto-upload="false"
                                    :file-="fileList" 
                                    :on-change="handleChange"
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
                                <el-button type="primary" class="submit-button" @click="submit">
                                提交
                                </el-button>
                              </el-col>
                              <el-col style="height: 50%;">

                              </el-col>
                            </el-row>
                        </el-card>
                    </el-col>
                    <el-col :span="8" class="mid-container">
                        <el-row class="container">
                            <el-col class="image-container">
                                <el-card class="fre-card" shadow="always" body-style="width:90%; height:90%;">
                                    <el-row>
                                        <el-col :span="12">
                                            <el-text class="title-text">频率图</el-text>
                                        </el-col>
                                    </el-row>
                                    <el-row style="height: 80%;">
                                        <el-image style="width: 100%; height: 100%" :src="url" fit="contain">
                                        </el-image>
                                    </el-row>
                                </el-card>
                            </el-col>
                            <el-col class="image-container">
                                <el-card class="tem-card" shadow="always" body-style="width:90%; height:90%;">
                                    <el-row>
                                        <el-col :span="12">
                                            <el-text class="title-text">热力图</el-text>
                                        </el-col>
                                    </el-row>
                                    <el-row style="height: 80%;">
                                        <el-image style="width: 100%; height: 100%" :src="url" fit="contain">
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
                            <el-row style="height: 40%;">
                              <el-text>{{ sentence }}</el-text>
                            </el-row>
                            <el-row>
                                <el-col :span="12" style="height: 10%;">
                                    <el-text class="title-text">词云图</el-text>
                                </el-col>
                            </el-row>
                            <el-row style="height: 40%;">
                            <div ref="cloud" style="height: 100%; width: 100%;"></div>
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

const fileUpload = ref(null)
const url = ''
const sentence = ref('')
const extractedWords = ref([])
 
 // 词汇数据
 
  const fruits = ref([
    { name: '互联网服务', value: 1000 },
    { name: '交通运输', value: 850 },
    { name: '公司', value: 800 },
    { name: '军工', value: 600 },
    { name: '医药', value: 900 },
    { name: '商务服务', value: 600 },
    { name: '城乡规划', value: 800 },
    { name: '家政服务', value: 400 },
    { name: '安防', value: 850 },
    { name: '医疗服务', value: 200 },
    { name: '电子科技', value: 8000 },
    { name: '航空航天', value: 1500 },
    { name: '食品饮料', value: 1500 },
    { name: '能源', value: 800 },
    { name: '教育培训', value: 200 },
    { name: '金融', value: 100 },
    { name: '文化娱乐', value: 250 },
    { name: '电力', value: 1200 },
    { name: '石油化工', value: 300 },
    { name: '电子商务', value: 900 },
    { name: '建筑', value: 700 },
    { name: '旅游', value: 550 },
    { name: '环保', value: 750 },
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
        width: '70%',
        height: '80%',
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
const upload = ref(null)
const fileList = ref([])

const handleExceed = (files) => {
  if (upload.value) {
    upload.value.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    upload.value.handleStart(file)
  }
}

const handleChange = (file, fileListNew) => {
  // 当文件变化时，修改文件名
  fileList.value = fileListNew.map(file => {
    return {
      ...file,
      name: `${file.name}`  // 这里修改文件名，替换为你的命名规则
    }
  })
}
// 提交文件方法
async function submit() {
  // 获取上传的文件
  const uploadedFiles = fileUpload.value.uploadFiles
  if (uploadedFiles.length === 0) {
    alert('请先上传文件再提交！')
    return
  }

  const file = uploadedFiles[0].raw // 获取第一个上传的文件
  console.log('上传的文件：', file)

  // 创建 FormData 对象，并添加文件
  const formData = new FormData()
  formData.append('file', file) // 这里假设后端需要接受字段名为 "file"

  try {
    // 使用 fetch 提交到后端
    const response = await fetch('https://your-server-endpoint/api/upload', {
      method: 'POST',
      body: formData
    })

    // 解析服务器返回的数据
    if (response.ok) {
      const responseData = await response.json()
      console.log('服务器响应：', responseData)
      // 从响应中处理句子和单词+置信度
      const { words } = responseData.data
      
      const sentence = words.map(wordObj => wordObj.word).join(' ')
      const wordData = words.map(wordObj => ({
        word: wordObj.word,
        confidence: wordObj.conf
      }))

      // 根据返回数据更新 UI 或词云图
      if (responseData.words) {
        fruits.value = wordData // 更新词云数据
        initCharts() // 重新渲染词云图
      }

    } else {
      console.error('上传失败！', response.statusText)
      alert('上传失败，请稍后再试！')
    }
  } catch (error) {
    console.error('提交过程出现错误：', error)
    alert('提交失败，请检查网络连接或稍后再试！')
  }
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
  height: 50%;
  display: flex;
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