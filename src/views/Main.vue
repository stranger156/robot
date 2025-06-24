<template>
  <div class="main">
    <div class="left">
        <SideBar/>
    </div>
    <div class="right">
        <ChatView :initialMessage="initialMessage"/>
    </div>
  </div>
</template>

<script lang="ts" setup name="App">
import { RouterView } from 'vue-router';
import { useRoute } from 'vue-router'
import { ref, watchEffect } from 'vue'
import ChatView from './ChatView.vue';
import SideBar from './SideBar.vue';
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

.right {
  flex-grow: 1;
  height: 100vh;
}
</style>