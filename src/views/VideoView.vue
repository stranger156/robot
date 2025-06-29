<template>
    <div class="page">
        <el-container>
            <el-header><el-text style="font-size: xx-large; font-weight: bolder;">音频风险检测</el-text></el-header>
            <el-main>
                <el-row :gutter="0" class="container">
                    <el-col :span="8" class="grid-container">
                        <el-card class="upload-card" shadow="always" body-style="width:80%; height:90%;">
                            <div class="upload-container">
                            <el-upload
                                class="upload"
                                drag
                                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
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
                            </div>
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

const url = ''
 
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
  height: 100%;
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