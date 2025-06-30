<template>
	<div class="common-layout">
	    <el-container style="height:100%;width:100%;margin: 0 auto;">
			 <el-header style="height: 50px; width: 100% ; ">
				<p class="centered-text">金盾智语——智能防诈骗客服</p>
			 </el-header>
			 <el-main id="chat">
				  <chat v-for="item in form.msgList" :msg=item></chat>
			 </el-main>
			 <el-row style="margin: 0 auto;padding-left: 20px;padding-right: 20px;width:80%">
				 <div style="width: 100%; background-color:rgb(243.9, 244.2, 244.8);border-radius: 20px;">
          
          <el-input 
              style="float: left;width: 100%;--el-input-bg-color: rgb(243.9, 244.2, 244.8);border: none;padding: 10px;font-size:18px " 
              v-model="form.input"
              class="inputTest"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 5 }"
              placeholder="给我发送消息"
              resize="none"
        ></el-input>
                <el-icon :size="30" @click="dialogFormVisible=true" style="float: left; margin-left: 15px;margin-bottom: 10px;"><Microphone  /></el-icon>
                <el-icon :size="30" @click="notifyParent" style=" margin-bottom: 10px;" ><Iphone /></el-icon>
                <el-icon :size="30" style="float: right;" @click="sendMsg"><Promotion /></el-icon>
              </div>
				 <div style="margin: 0 auto;">
					<p style="color: red;font-size: 15px;margin-top: 5px;">
				内容由AI生成，请仔细甄别之后进行使用
					</p>
				 </div>
			 </el-row>
             <!-- 音频弹框 -->
        <el-dialog v-model="dialogFormVisible"   width="500">
          <div v-loading="show"  element-loading-text="发送中...">
          <img :src="address" alt="录音" class="micro">
  <div class="voice-recorder">
    <audio v-if="audioUrl" :src="audioUrl" controls style="width:100%"></audio>
    <br>
    <button @click="startRecording" :disabled="isRecording">开始</button>
    <button @click="stopRecording" :disabled="!isRecording">停止</button>
    <button @click="sendRecording" :disabled="!audioBlob">发送</button>
    
    <div v-if="isRecording" class="recording-indicator" style="margin-left: 36%;">
      <span class="dot"></span> 正在录音...
    </div>
  </div>
    <!-- <el-table v-loading="true" :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table> -->
  </div>
        </el-dialog>
		</el-container>
	</div>
</template>
<script setup>
import Chat from '@/components/Chat.vue';
import {Microphone,Iphone} from '@element-plus/icons-vue'
import { reactive,nextTick, ref,onUnmounted,watchEffect ,watch, onBeforeUnmount, onMounted, computed} from 'vue'
import axios from 'axios';
import { useDialogStore } from '@/stores/dialogId';
import qs from 'qs'; // 或使用 URLSearchParams
import RecordRTC from 'recordrtc';
import taping from "@/image/taping.png";
import record from "@/image/record.png";
import { getAnswer, getHistory, getText } from '@/utils/api';
const dialog=useDialogStore()
const dialogId=computed(()=>dialog.dialog.id)
const show=ref(false)
const address = ref(taping);
const isRecording = ref(false);
const audioBlob = ref(null);
const audioUrl = ref('');
const dialogFormVisible = ref(false);
let recorder = null;
let mediaStream = null;
	const form = reactive({
	  input: '',//输入
	  msgList:[] //消息列表
	});
  const nowId=ref('')
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

const stopRecording = () => {
  address.value = taping;
  if (!recorder) return;
  
  recorder.stopRecording(() => {
    isRecording.value = false;
    audioBlob.value = recorder.getBlob();
    audioUrl.value = URL.createObjectURL(audioBlob.value);
    
    // 停止媒体流
    mediaStream.getTracks().forEach(track => track.stop());
  });
};
// 定义事件
const emit = defineEmits(['childEvent'])

const notifyParent = () => {
  // 触发事件并传递数据
  emit('childEvent', true)
}

const sendRecording = async () => {
  if (!audioBlob.value) return;
  try {
    show.value=true
    const formData = new FormData();
    formData.append('audiofile', audioBlob.value); // 修改为.mp3后缀
    getText(formData).then(res=>{
   show.value=false
      form.input=res.text;
      dialogFormVisible.value=false
      setTimeout(()=>{
        sendMsg()
      },500)
      audioBlob.value = null;
      audioUrl.value = '';
    })

  } catch (error) {
    console.error('发送录音出错:', error);
    alert('发送录音时出错');
  }
   show.value=false
};
watch(dialogFormVisible, (newVal) => {
  if(newVal===true){
     audioBlob.value = null;
      audioUrl.value = '';
  }
  console.log('count 变化了:', newVal);
});

onBeforeUnmount(() => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
  }
});

async function sendMsg() {
    const keyword = form.input;
    if (keyword.length > 0) {
        // 初始化消息
        const msg = {
            question: keyword,
            answer: "AI生成中..."
        };
        form.msgList.push(msg);
        form.input = "";
        setScrollToBottom();

        try {
          let  str=form.msgList.length===1?"true":"false"
            const id=localStorage.getItem("id")
            const data = qs.stringify({  // 转换为 URL 编码格式
                prompt: keyword,
                isNewDialog: str,
                dialog_id: id
            });
            console.log(form.msgList.length)
            getAnswer(data).then(res=>{
                nowId.value=res.dialog_id
            dialog.setDialogInfo(res.dialog_id)
              const answer = res.answer;
               // 移除"AI生成中..."消息
            form.msgList.pop();
            
            // 创建新消息用于伪流式显示
            const streamingMsg = reactive({
                question: keyword,
                answer: ""
            });
            form.msgList.push(streamingMsg);
              let charIndex = 0;
            const displayInterval = setInterval(() => {
                if (charIndex < answer.length) {
                    streamingMsg.answer += answer[charIndex];
                    charIndex++;
                    setScrollToBottom();
                } else {
                    clearInterval(displayInterval);
                }
            }, 50); // 调整这个数字可以改变显示速度
            })

        } catch (error) {
            console.error('请求失败:', error);
            form.msgList.pop();
            form.msgList.push({
                question: keyword,
                answer: "请求失败: " + error.message
            });
            setScrollToBottom();
        }
    }
}
	/*内容显示过多时自动滑动*/
	async function setScrollToBottom() {
	  await nextTick()
	  let chat = document.querySelector("#chat")
	  chat.scrollTop = chat.scrollHeight
	}
  const gethistory=async(newId)=>{
getHistory().then(res=>{
 let list=[];
  Object.keys( res.historys).forEach(key=>{
     if(key==newId){
      res.historys[key].forEach(item=>{
              list.push({
                question:item.question,
                answer:item.answer
              })
            })   }  })
                 form.msgList=list
             setScrollToBottom();
})
  
  }
	// 监听 store 中的 ID 变化
watch(dialogId, (newId) => {
if(newId!==nowId.value){
  nowId.value=newId
  gethistory(newId)
}

})
const props = defineProps({
  initialMessage: String,
 data:String
})

// 监听 initialMessage 的变化
watch(() => props.initialMessage, (newVal) => {
  if (newVal) {
    console.log(newVal)
    localStorage.setItem('id','1000')
    setTimeout(()=>{
 form.input = newVal
    sendMsg()  
    },1000)
   
  }
}, { immediate: true })
watch(() => props.data, (newVal) => {
  if (newVal) {
       const msg = {
            question: newVal.question,
            answer:"Ai生成中..."
        };
         form.msgList.push(msg);
          setScrollToBottom();
              nowId.value=newVal.dialog_id
            dialog.setDialogInfo(newVal.dialog_id)
          const answer=newVal.answer;
          form.msgList.pop()
            // 创建新消息用于伪流式显示
            const streamingMsg = reactive({
                question: newVal.question,
                answer: ""
            });
            form.msgList.push(streamingMsg);
              let charIndex = 0;
            const displayInterval = setInterval(() => {
                if (charIndex < answer.length) {
                    streamingMsg.answer += answer[charIndex];
                    charIndex++;
                    setScrollToBottom();
                } else {
                    clearInterval(displayInterval);
                }
            }, 100); // 调整这个数字可以改变显示速度
  }
}, { immediate: true })
onMounted(()=>{
  let id=localStorage.getItem('id')
  gethistory(id)
})
</script>
<style scoped>
html,body{
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	border: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height:100%;min-width: 380px;
}
.common-layout{
	height: 100%;
}
#chat{
	height: calc(100vh - 150px);
}

.el-icon {
  float: left;
  margin-right: 20px;
  margin-top: 5px;
  transition: color 0.3s; /* 添加过渡效果 */
}
:deep(.el-textarea .el-textarea__inner) {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

/* 移除聚焦状态下的边框 */
:deep(.el-textarea.is-focus .el-textarea__inner) {
  border: none !important;
  box-shadow: none !important;
}
.el-icon:hover {
  color: #409eff; /* 悬停颜色（Element Plus 主色） */
 
}
.el-dialog{
  margin-top: 300px;
  margin-left: 40%;
}
.voice-recorder {
  margin: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.el-textarea {
  /* 确保与原有样式一致 */
  box-sizing: border-box;
}
.inputText{
  border: 0;

}
.el-textarea__inner {
  box-shadow: 0 0 0 0px;
}

.el-textarea__inner:hover {
  box-shadow: 0 0 0 0px;
}

.el-textarea__inner:focus {
  box-shadow: 0 0 0 0px;
}
.inputText .el-textarea__inner {
  /* 移除默认的resize手柄（可选） */
  background-color: rgb(243.9, 244.2, 244.8);
  /* resize: none; */
  padding: 10px 15px;
  line-height: 1.5;
}
button {
  margin-left: 2px;
  width:100px;
  margin-right: 30px;
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.recording-indicator {
  margin-top: 10px;
  color: #ff5252;
}

.micro{
  animation: pulse 2s infinite ease-in-out;
  margin-left: 165px;

}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: #ff5252;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}
.centered-text{
      text-align: center;
      line-height: 50px;
      font-size:30px;
}
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>
