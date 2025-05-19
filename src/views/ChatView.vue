<template>
	<div class="common-layout">
	    <el-container style="height:100%;width:100%;margin: 0 auto;">
			 <el-header style="height: 50px; width: 100% ; background-color:rgba(0,102,255,.06)">
				<p class="centered-text">金融防诈骗</p>
			 </el-header>
			 <el-main id="chat">
				  <chat v-for="item in form.msgList" :msg=item></chat>
			 </el-main>
			 <el-row style="margin: 0 auto;padding-left: 20px;padding-right: 20px;">
				 <div style="width: 100%;">
					<el-input style="float: left;width: 90%;" @keyup.enter="sendMsg" v-model="form.input"></el-input>
					<el-button @click="sendMsg" style="float: right; height: 42px;line-height: 42px;" >发送</el-button>
				 </div>
				 <div style="margin: 0 auto;">
					<p style="color: red;font-size: 11px;">
					 服务生成的所有内容均由人工智能模型生成，其生成内容的准确性和完整性无法保证，不代表我们的态度或观点
					</p>
				 </div>
			 </el-row>
		</el-container>
	</div>
</template>
<script setup>
import Chat from '@/components/Chat.vue';
import { reactive,nextTick, ref } from 'vue'
import axios from 'axios';
	const form = reactive({
	  input: '',//输入
	  msgList:[] //消息列表
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
            const params = new URLSearchParams();
            params.append('prompt', keyword);

            const response = await axios.post(
                'http://10.19.131.206:5000/api/chat',
                params.toString(),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }
            );
				console.log(response)
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const answer = response.data.answer;
            
            // 移除"AI生成中..."消息
            form.msgList.pop();
            
            // 创建新消息用于伪流式显示
            const streamingMsg = reactive({
                question: keyword,
                answer: ""
            });
            form.msgList.push(streamingMsg);

            // 逐字显示效果
            let charIndex = 0;
            const displayInterval = setInterval(() => {
                if (charIndex < answer.length) {
                    streamingMsg.answer += answer[charIndex];
                    charIndex++;
                    setScrollToBottom();
                } else {
                    clearInterval(displayInterval);
                }
            }, 30); // 调整这个数字可以改变显示速度

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
	
</script>
<style>
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
.el-input{
	height: 45px;
	border-radius: 12px;
	box-sizing: border-box;
}
</style>
