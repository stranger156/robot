<template>
<div id="chat-container">  
    <div class="top">
        <div class="block">
          <img src="../image/logo2.png" alt="">
        </div>
        <div style="text-align: center;" >{{ status }}</div>
         <span v-loading="true" style="width: 10px;height: 10px;top: 50px;margin-left: 220px;"></span>
    </div>
    <div class="mid">
      <div style="text-align: center;">    {{ prompt }}</div>
        </div>
<div class="bottom">

   <el-button v-show="isshow"  @click="stopCord" circle style="width:70px;height: 70px;margin-left: 120px;" >
     <img src="../image/micophone.png" style="width: 30px;height: auto;" alt="">
  </el-button>
  <el-button v-show="!isshow"  @click="startCord" circle style="width:70px;height: 70px;margin-left: 120px;" >
     <img src="../image/stopmico.png" style="width: 30px;height: auto;" alt="">
  </el-button>
  <el-button circle @click="notifyParent" style="width:70px;height: 70px;margin-left: 120px;">
       <img src="../image/close.png" style="width: 30px;height: auto;" alt="">
  </el-button>
</div>
 
</div>

</template>
<script setup>
import { onMounted, ref } from 'vue';
import RecordRTC from 'recordrtc';
import { chat, getText } from '@/utils/api';

const prompt=ref('你可以开始说话了')
const isshow=ref(true)
const status=ref('')
// 定义事件
const emit = defineEmits(['childEvent','send-data'])

const notifyParent = () => {
  // 触发事件并传递数据
  isshow.value=false
  emit('childEvent', false)
    if (!recorder) return;
  recorder.stopRecording(() => {
    isRecording.value = false;
    audioBlob.value = recorder.getBlob();
    console.log(audioBlob.value)
    audioUrl.value = URL.createObjectURL(audioBlob.value);
    
    // 停止媒体流
    mediaStream.getTracks().forEach(track => track.stop());
  });
}
let mediaStream = null;
const isRecording = ref(false);
const audioBlob = ref(null);
const audioUrl = ref('');
let recorder = null;
const volume = ref(0);
let audioContext, processor, source;
const startCord=()=>{
  prompt.value="您可以开始说话了"
isshow.value=!isshow.value
startRecording()
}
const stopCord=()=>{
  isshow.value=!isshow.value
    if (!recorder) return;
  recorder.stopRecording(() => {
    isRecording.value = false;
    audioBlob.value = recorder.getBlob();
    console.log(audioBlob.value)
    audioUrl.value = URL.createObjectURL(audioBlob.value);
    
    // 停止媒体流
    mediaStream.getTracks().forEach(track => track.stop());
  });
    prompt.value="您已静音 🔇"
    console.log(prompt.value)
}
const startRecording = async () => {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    source = audioContext.createMediaStreamSource(mediaStream);
    processor = audioContext.createScriptProcessor(2048, 1, 1);
    source.connect(processor);
    processor.connect(audioContext.destination);
    
    processor.onaudioprocess = processAudio;

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
function debounce(func, wait = 300) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

// 创建防抖函数实例
const debouncedSoundAlert = debounce(() => {
  console.log("检测到声音 🔊");
  stopRecording()
}, 3000);

const debouncedSilenceAlert = debounce(() => {
  console.log("静音 🔇");
}, 3000);
const processAudio = (event) => {
  const inputBuffer = event.inputBuffer;
  const inputData = inputBuffer.getChannelData(0);
  
  // 计算音量 (RMS)
  let sum = 0;
  for (let i = 0; i < inputData.length; i++) {
    sum += inputData[i] ** 2;
  }
  const rms = Math.sqrt(sum / inputData.length);
  volume.value = rms;
  
  // 判断是否有声音 (阈值需要根据环境调整)
  const THRESHOLD = 0.1; 
  if (rms > THRESHOLD) {
    if(isshow.value){
 prompt.value="静音中 🔇"
    }
    debouncedSoundAlert(); // 触发声音提示
  } else {
    if(isshow.value){
 prompt.value="声音检测中 🔊"
    }
    debouncedSilenceAlert(); // 触发静音提示
  }
};
const stopRecording = () => {
  if (!recorder) return;
  recorder.stopRecording(() => {
    isRecording.value = false;
    audioBlob.value = recorder.getBlob();
    console.log(audioBlob.value)
    audioUrl.value = URL.createObjectURL(audioBlob.value);
    
    // 停止媒体流
    mediaStream.getTracks().forEach(track => track.stop());
      sendRecording()
  });
};
const audioPlayer = ref(null);
const isPlaying = ref(false);

const sendMessage = (res) => {
  emit('send-data',res);
};
const sendRecording = async () => {
  if (!audioBlob.value) return;
  try {
    const formData = new FormData();
    const id=localStorage.getItem("id")
    let isNewDialog=id==1000?"true":"false"
    let gender=localStorage.getItem('gender')
    let token=localStorage.getItem('token')
    status.value="语音识别中..."
    formData.append('audiofile', audioBlob.value); // 修改为.mp3后缀
    formData.append('isNewDialog',isNewDialog)
    formData.append("dialog_id",id)
    formData.append('gender',gender)
    formData.append('token',token)
    chat(formData).then(res=>{
      console.log(res)
      if(res.is_null=="true"){
        console.log("发送的声音为空")
        status.value="未识别到语音，请重说！"
        startRecording()
        return ;
      }
      console.log(res)
      sendMessage(res)
      localStorage.setItem("id",res.dialog_id)
       const byteCharacters = atob(res.audio);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    const slice = byteCharacters.slice(offset, offset + 1024);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    byteArrays.push(new Uint8Array(byteNumbers));
  }
 const blob = new Blob(byteArrays, { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
     if (audioPlayer.value) {
      URL.revokeObjectURL(audioPlayer.value.src);
    }
   
     audioPlayer.value = new Audio(url);
      console.log(audioPlayer.value)
	    // 播放音频
      status.value="说话中..."
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
        status.value=""
      if(isshow.value){
              setTimeout(()=>{
        console.log("开始录音")
startRecording()
      })
      }

      
    };
      audioBlob.value = null;
      audioUrl.value = '';
    })

  } catch (error) {
    console.error('发送录音出错:', error);
    alert('发送录音时出错');
  }
};
onMounted(()=>{
  startRecording()
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