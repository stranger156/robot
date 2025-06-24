<template>
  <div class="main">
    <div v-show="!visable" class="left">
        <SideBar />
    </div>
    <div class="mid">
        <ChatView   @childEvent="handleChildEvent"
  />
    </div>
    <div v-if="visable" class="right">
 <Content  @childEvent="handleChildEvents"/>
    </div>
  </div>
</template>

<script  setup name="App">
import { RouterView } from 'vue-router';
import ChatView from './ChatView.vue';
import SideBar from './SideBar.vue';
import { onMounted, ref } from 'vue';
import Content from '@/components/content.vue';
const visable=ref(false)
const handleChildEvent = (data) => {
  visable.value=data
}
const handleChildEvents = (data) => {
  visable.value=data
}
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