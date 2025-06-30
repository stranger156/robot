<template>
    <div class="page">
    <header class="top-bar">
      <div class="logo"><img :src="logoImg" alt="logo" class="logo-img" /></div>
      <!-- 可扩展菜单按钮 -->
    </header>

    <div class="hero-section">
      <div class="container">
            <!-- 聊天框 -->
            <div style="width: 50%; background-color:rgb(243.9, 244.2, 244.8);border-radius: 20px; padding: 10px; display: flex; align-items: flex-end;" >
                <el-input 
                    style="float: left;--el-input-bg-color: rgb(243.9, 244.2, 244.8);border: none;padding: 10px;font-size:18px " 
                    v-model="form.input"
                    class="inputTest"
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 5 }"
                    placeholder="给我发送消息"
                    resize="none"
                ></el-input>

                        <el-icon :size="30" style="float: right;" @click="handleSend"><Promotion /></el-icon>
                    </div>
                        <div style="margin: 0 auto;"></div>

            <!-- 下方两个带阴影的卡片 -->
            <div class="bottom-panels">
                <div class="panel" @click="gotoChat()">
                    <div class="text">左侧卡片</div>
                </div>
                <div class="panel" @click="gotoVideo()">
                    <div class="text">右侧卡片</div>
                </div>
            </div>
        </div>
    </div>

    <div class="content-section">
      <!-- 下方 30% 的区域内容 -->
      <p>这里是下方内容区域，可放按钮、介绍等</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Promotion } from '@element-plus/icons-vue'
import logoImg from '@/image/avater.png'
import bgImg from "@/image/menuBg.png"
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  input: '',
})

const handleSend = () => {
  console.log(form.value.input.trim())
  router.push({
    path: '/Main', // 或 name: 'MainChat'
    query: {
      msg: form.value.input // 传递输入框的消息
    }
  })
}

const gotoChat = () => {
  router.push({
    path: '/Text'
  })
}

const gotoVideo = () => {
  router.push({
    path: '/Video'
  })
}
</script>

<style scoped>
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
}

#app {
  max-width: none !important;
  width: 100vw;
}
/* 页面整体结构 */
.page {
  width: 100vw;
  height: 100vh;
  margin: 0;
  overflow: hidden;
  font-family: 'Helvetica Neue', sans-serif;
}

/* 顶部栏 */
.top-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  z-index: 100;
}

.logo {
  height: 64px;     /* 设定固定的高度，保证圆形 */
  width: 64px;      /* 宽度和高度相同，保持圆形 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  width: 100%;     /* 使图片充满父容器 */
  height: 100%;    /* 保证图片高度与宽度一致 */
  border-radius: 50%;  /* 让图片变成圆形 */
  object-fit: cover;   /* 保证图片覆盖整个圆形区域 */
}

/* 上方背景图区域 */
.hero-section {
  height: 80vh;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #5db4e3;
  background: linear-gradient(0deg, rgba(93, 180, 227, 0.68) 0%, rgba(255, 255, 255, 1) 100%);
}

.container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;  /* 主体在中间 */
  align-items: center;
  box-sizing: border-box;
}

.chat-box {
  max-width: 700px;
  background-color: rgb(243.9, 244.2, 244.8);
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 40px;
  box-sizing: border-box;
}

.inputText {
  --el-input-bg-color: rgb(243.9, 244.2, 244.8);
  border: 0;
  height: 5vh;
}

:deep(.el-textarea .el-textarea__inner) {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  background-color: rgb(243.9, 244.2, 244.8);
  padding: 10px 15px;
  line-height: 1.5;
}

:deep(.el-textarea.is-focus .el-textarea__inner) {
  border: none !important;
  box-shadow: none !important;
}

:deep(.el-textarea__inner) {
  box-shadow: 0 0 0 0px;
}
:deep(.el-textarea__inner:hover),
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 0px;
}

.el-icon {
  float: left;
  margin-right: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  transition: color 0.3s;
  cursor: pointer;
}
.el-icon:hover {
  color: #409eff;
}

.send-icon {
  font-size: 24px;
  margin-left: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: color 0.3s;
}

.bottom-panels {
  margin-top: 3%;
  display: flex;
  gap: 10%;
  width: 50%;
  height: 15vh;
}

.panel {
  flex: 1;
  width: 45%; /* 控制宽度 */
  max-width: 500px;
  height: 100%;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;      /* 垂直居中 */
  backdrop-filter: blur(2px);
  background-color: rgba(0,191,255, 0.076);
  box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
  border: 2px rgba(255,255,255,0.4) solid;
  border-bottom: 2px rgba(40,40,40,0.35) solid;
  border-right: 2px rgba(40,40,40,0.35) solid;
}

.panel:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
}

.text {
  /* 单独对文字块进行控制 */
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: block;  /* 使文字块在卡片中独立 */
  padding-left: 5px;
}
.content-section {
  height: 30vh;
  padding: 40px;
  background-color: #ffffff;
  text-align: center;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>