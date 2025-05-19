<template>
  <div class="main">
    <div class="left"></div>
    <div class="right">
        <ChatView/>
    </div>
  </div>
</template>

<script lang="ts" setup name="App">
import { RouterView } from 'vue-router';
import ChatView from './ChatView.vue';
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
  background-color: #ca1818;
  flex-basis: 300px;
  flex-shrink: 0;
  height: 100vh;
}

.right {
 
  flex-grow: 1;
  height: 100vh;
}
</style>