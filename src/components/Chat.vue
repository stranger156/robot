<template>
<div class="chat" style="margin-top: 30px;">
	<!--问题-->
	<div style="text-align: right;">
  <div style="display: flex; justify-content: flex-end; align-items: flex-end;">
    <div class="el-card chat-right" style="order: 1;">
      {{msg.question}}
    </div>
    <el-avatar :size="40" style="margin-left: 10px; order: 2;">
      <img class="avater" src="../image/avater.png" alt="">
    </el-avatar>
  </div>
</div>
	<!--AI回答-->
	<div style="text-align: left; margin-top: 30px;">
  <div style="display: flex; align-items: flex-start;">
    <el-avatar :size="40" style="margin-right: 10px; flex-shrink: 0;">
      <img class="avater" v-if="gender=='male'" src="../image/male.png" alt="">
	   <img class="avater" v-if="gender=='female'" src="../image/female.png" alt="">
    </el-avatar>
    <div class="el-card chat-left" v-html="compiledMarkdown(msg.answer)">
    </div>
  </div>
  
  <div style="margin-top: 10px; margin-left: 50px;">
    <!-- <el-button :icon="Search" circle /> -->
    <el-button type="primary" :icon="DocumentCopy" @click="copyText(msg.answer)" circle />
    <!-- <el-button type="info" :icon="Check" circle /> -->
    <el-button type="success" :icon="VideoPlay" circle @click="read"  v-loading.fullscreen.lock="show" 
	 element-loading-text="加载中..."/>
    <el-button type="danger" :icon="VideoPause" circle @click="stopVideo"/>
    <!-- <el-button type="warning" :icon="Star" circle />
    <el-button type="danger" :icon="Delete" circle /> -->
  </div>
</div>
</div>
</template>
<script setup>
import {Check,Delete,Edit,Message,Search,Star,VideoPlay,DocumentCopy,VideoPause} from '@element-plus/icons-vue'
import axios from 'axios'
import { ref,computed } from 'vue'
import {marked} from 'marked';
import { useSettingStore } from '@/stores/setting';
import { readText } from '@/utils/api';
const set=useSettingStore()
const gender=computed(()=>set.setting.gender)

const show=ref(false)
const props = defineProps({
  msg: Object
})
const count = ref(0)
const compiledMarkdown=(dialog)=>{
      return marked(dialog);
    }
    const copyText=async(text)=>{
   await navigator.clipboard.writeText(text);
}

// 在组件外部定义音频对象和播放状态
const audioPlayer = ref(null);
const isPlaying = ref(false);
const stopVideo=()=>{
  if (isPlaying.value && audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value.currentTime = 0;
    isPlaying.value = false;
    return;
  }
}
const read=()=>{
show.value=true
	const formData=new FormData()
	formData.append('ai_text',props.msg.answer)
	formData.append('gender',localStorage.getItem("gender"))
  readText(formData).then(res=>{
					show.value=false
            const blob = res;
            const url = URL.createObjectURL(blob);
     if (audioPlayer.value) {
      URL.revokeObjectURL(audioPlayer.value.src);
    }
     audioPlayer.value = new Audio(url);
	    // 播放音频
    audioPlayer.value.play()
      .then(() => {
        isPlaying.value = true;
      })
      .catch(e => {
        console.error("播放失败:", e);
        isPlaying.value = false;
      });
        // 监听播放结束事件
    audioPlayer.value.onended = () => {
      isPlaying.value = false;
    };
     // 创建隐藏的下载链接
    const a = document.createElement('a');
    a.href = url;
    a.download = `audio_${new Date().getTime()}.${getFileExtension(blob.type)}`;
    document.body.appendChild(a);
    // a.click();
	 setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
    
// 根据MIME类型获取文件扩展名
function getFileExtension(mimeType) {
  const extensions = {
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/ogg': 'ogg',
    'audio/webm': 'webm',
    'audio/aac': 'aac'
  };
  return extensions[mimeType.toLowerCase()] || 'audio';
}
  })
   }

</script>
<style scoped>
.chat{
	max-width: 1000px;
	margin: 0 auto;
	padding-top: 10px;
	padding-bottom: 10px;
}
.ai-img
{
	height: 36px;
	width: 36px;
}
.chat-left
{
	background-color: #f5f6f7!important;
	display: inline-block;
	box-sizing: border-box;
	width: auto;
	text-align: left;
	border-radius: 12px;
	line-height: 24px;
	max-width: 100%;
	padding: 12px 16px;
	white-space: pre-wrap;
	
}
.chat-right
{
	 background-color: #e0dfff;
  display: inline-block;  /* 或 flex/inline-flex 根据布局需求 */
  box-sizing: border-box;
  width: auto;
  color: #3f3f3f;
  border-radius: 12px;
  line-height: 24px;
  max-width: 100%;       /* 限制最大宽度为父容器宽度 */
  padding: 12px 16px;
  white-space: pre-wrap; /* 保留空格和换行符，允许自动换行 */
  word-break: break-word; /* 长单词或URL强制换行 */
  overflow-wrap: break-word; /* 兼容性更好的属性 */
   word-break: break-all;  /* 强制所有字符换行（包括连续字母） */
  overflow-wrap: anywhere; /* 更智能的换行（兼容性较好） */
}
</style>
