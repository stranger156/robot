<template>
<div id="chat-container">  
    <div class="top">
        <div class="block">
          <img src="../image/avater.png" alt="">
        </div>
    </div>
    <div class="mid">
      <div style="text-align: center;">    {{ prompt }}</div>
      
        </div>
<div class="bottom">
  <el-button circle style="width:70px;height: 70px;margin-left: 120px;" >
     <img src="../image/micophone.png" style="width: 30px;height: auto;" alt="">
  </el-button>
  <el-button circle @click="notifyParent" style="width:70px;height: 70px;margin-left: 120px;">
       <img src="../image/close.png" style="width: 30px;height: auto;" alt="">
  </el-button>
</div>
 
</div>

</template>
<script setup>
import { onMounted, ref } from 'vue';
const circleUrl='../image/avater.png'
const prompt=ref('你可以开始说话了')
// 定义事件
const emit = defineEmits(['childEvent'])

const notifyParent = () => {
  // 触发事件并传递数据
  emit('childEvent', false)
}
const startRecording = async () => {
  address.value = record;
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    recorder = new RecordRTC(mediaStream, {
      type: 'audio',
      mimeType: 'audio/mpeg', // 修改为MP3类型
      recorderType: RecordRTC.StereoAudioRecorder,
      audioBitsPerSecond: 128000, // 128kbps比特率
      desiredSampRate: 44100, // 采样率
      numberOfAudioChannels: 1 // 单声道
    });
    
    recorder.startRecording();
    isRecording.value = true;
    audioBlob.value = null;
    audioUrl.value = '';
  } catch (error) {
    console.error('无法访问麦克风:', error);
    alert('无法访问麦克风，请检查权限设置');
  }
};
onMounted(()=>{
  console.log(111)
})

</script>
<style scoped>
.top{
  height:70vh;
}
.block{
  text-align: center;
padding-top: 30vh;

}
.mid{
  height:10vh;
}
img{
  width:100px;
  height:100px;
  border-radius: 50px;
}
</style>