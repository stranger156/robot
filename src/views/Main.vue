<template>
  <div class="main">
    <div v-show="!visable" class="left">
        <SideBar />
    </div>
    <div class="mid">
        <ChatView   @childEvent="handleChildEvent"
        :initialMessage="initialMessage" 
       :data="data"
      
  />
    </div>
    <div v-if="visable" class="right">
 <Content  @childEvent="handleChildEvents"   @send-data="handleData" />
  </div>
  </div>
</template>

<script  setup name="App">
import { RouterView } from 'vue-router';
import { useRoute } from 'vue-router'
import ChatView from './ChatView.vue';
import SideBar from './SideBar.vue';
import { onMounted, ref, watchEffect } from 'vue';
import Content from '@/components/content.vue';
// const id= ref('');
// const question=ref('')
// const answer=ref('')
const data=ref('')
const handleData = (res) => {
  // question.value=data.question
  // answer.value=data.answer
  // id.value=data.id
  data.value=res
};
const visable=ref(false)
const handleChildEvent = (data) => {
  visable.value=data
}
const handleChildEvents = (data) => {
  visable.value=data
}
const route = useRoute()
const initialMessage = ref('')

// 当路由的 `query` 参数改变时，更新 `initialMessage`
watchEffect(() => {
  if (route.query.msg) {
    initialMessage.value = String(route.query.msg)
  }
})
</script>

<style scoped>
/* 确保全局样式不影响 */
html, body {
  margin: 0;
  padding: 0;
}

.main {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
}

.left {
  /* 不再用 flex-basis 强制 300px */
  /* flex-basis: 300px; */
  /* 改为： */
  flex: 0 0 auto;
  /* 或者直接不写宽度相关，由 el-aside 的 :width 接管 */
  background-color:white;
  height: 100vh;
}

.mid {
  flex-grow: 1;
  height: 100vh;
}
.right{
  flex-basis: 500px;
  /* 或者直接不写宽度相关，由 el-aside 的 :width 接管 */
  background-color:rgb(249, 248, 248);
  height: 100vh;
}
</style>