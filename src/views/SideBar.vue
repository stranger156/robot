<template>
  <!-- 弹窗 -->
    <el-dialog 
  v-model="showModal" 
  :show-close="false"
>
  
    <div class="dialog-header">
      <h2 class="dialog-title">防诈骗知识库</h2>
      <el-icon :size="30" @click="showModal = false" style="margin-right: 10px;"> <Close /></el-icon>
  
    </div>

    <ul class="article-list">
      <li 
        v-for="(article, index) in articles" 
        :key="index"
        class="article-item"
      >
        <a
          :href="article.url"
          target="_blank"
          class="article-link"
        >
          <span class="link-text">{{ article.title }}</span>
          <svg class="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </a>
      </li>
    </ul>

</el-dialog>
  <el-aside :width="collapsed ? '60px' : '300px'" class="chat-sidebar">
    <!-- 折叠按钮 -->
    <el-button 
    class="collapse-btn" 
    @click="toggleCollapse"
    type="primary" 
    size="small"
    circle
  >
    <!-- 动态切换图标 -->
    <el-icon :size="30" color="black">
      <component :is="collapsed ? ArrowRight : ArrowLeft" />
    </el-icon>
  </el-button>
  <div style="display: flex; align-items: center;padding: 10px;">
 <img src="../image/last.png" style="width: 30px;height: 30px;margin-left: 5px;" @click="toMenu" alt="">
   <div 
      style="width: 60%;background-color: rgb(190, 215, 240);margin-left: 20px;
      margin-bottom: 20px;border-radius: 10px;height: 40px;margin-top: 20px;display: inline-block;
     " v-if="!collapsed" @click="addDialog">
         <el-icon :size="30" style="float: left;margin-top: 5px;margin-left: 10px;"><Connection /></el-icon>
       <h1 style="font-size: 20px;margin-top: 4px;">开启新的对话</h1>
      </div>
  </div>
 
    <!-- 聊天列表 -->
      <history class="chat-list" v-if="!collapsed"/>

    <!-- 用户头像及弹出菜单 -->
<el-dropdown class="avatar-wrapper" trigger="click" >
  <span style="width: 100%;">
      <el-avatar :size="40"><img class="avater" style="float: left;" src="../image/avater.png" alt="">  </el-avatar>
  </span>
  <template #dropdown>
    <div class="avatar-menu" style="width: 200px;float: left;">
      <div class="avatar-name" style="height: 40px;text-align: center;line-height: 40px;"><h1>{{ userName }}</h1></div>
      <el-dropdown-item command="settings" @click="open">
        <el-icon><Setting /></el-icon><span>系统设置</span>
      </el-dropdown-item>
      <el-dropdown-item command="logout" @click="toLogin">
        <el-icon><Remove /></el-icon><span>退出登录</span>
      </el-dropdown-item>
      <el-dropdown-item command="comment" @click="showComment">
        <el-icon><MoreIcon /></el-icon><span>防诈文档</span>
      </el-dropdown-item>
    </div>
  </template>
</el-dropdown>

  <el-icon :size="30" style="float: left;margin-left: 15px;margin-top: 10px;" v-if="collapsed"><Connection /></el-icon>
  </el-aside>
    <el-dialog
    v-model="dialogVisible"
    title="系统设置"
    width="500"
  >
    <h3>AI音色选择：</h3> <el-select v-model="value" placeholder="Select" style="width: 240px">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
// import  { Action } from 'element-plus'
import history from '@/components/history.vue'
import { ref, computed, onMounted } from 'vue'
import { Search as SearchIcon, More as MoreIcon } from '@element-plus/icons-vue'
import { ArrowRight, ArrowLeft } from '@element-plus/icons-vue'
import { useSettingStore } from '@/stores/setting'
import { useDialogStore } from '@/stores/dialogId';
import axios from 'axios'
import router from '@/router'
import { getUser } from '@/utils/api'
const showModal=ref(false)
const set=useSettingStore()
const dialogVisible=ref(false)
const collapsed = ref(false)
const dialog=useDialogStore()
const userName=ref('')
const value=ref(localStorage.getItem('gender'))
const options=[{
  value:'male',
  label:'男声'
},{
 value:'female',
  label:'女声'
}
]
const articles = [
   { title: '警惕冒充客服诈骗', url: 'https://m.thepaper.cn/baijiahao_19569010' },
  { title: '如何识别刷单骗局', url: 'https://special.cpd.com.cn/2023/qmfz/yjjm/923/t_1104790.html' },
  { title: '防范网络贷款诈骗', url: 'https://www.sohu.com/a/875188312_122066678' },
  { title: '警惕冒充熟人要钱', url: 'https://www.thepaper.cn/newsDetail_forward_28338449' },
  { title: '识别冒充公检法诈骗', url: 'https://www.thepaper.cn/newsDetail_forward_29675273' }
];
function toggleCollapse() {
  collapsed.value = !collapsed.value
}
const toMenu=()=>{
  router.push('Menu')
}
const confirm=()=>{
dialogVisible.value = false;
set.setSettingInfo(value.value)
  ElMessage({
    message: '设置修改成功',
    type: 'success',
  })
}
const addDialog=()=>{
  console.log("添加新对话")
dialog.setDialogInfo("1000")
}
const toLogin=()=>{
  router.push('/')
}
const showComment=()=>{
  showModal.value=true
}
const open=()=>{
  dialogVisible.value=true
}

onMounted(()=>{
getUser().then(res=>{
  userName.value=res.userInfo.userName
})
})
</script>

<style scoped>
/* 覆盖层样式 */
.dialog-overlay {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

/* 弹窗容器 */
.dialog-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  /* max-width: 640px; */
  width: 100%;
  height:100%;
  /* margin: 0 1rem;
  padding: 1.5rem; */
}

/* 头部样式 */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-bottom: 1.5rem;
  padding-bottom: 1rem; */
  /* border-bottom: 1px solid #f3f4f6; */
}

.dialog-title {
  margin-bottom: 10px;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

/* 关闭按钮 */
.close-btn {
  padding: 0.5rem;
  /* color: #9ca3af; */
  border-radius: 9999px;
  border-color:white;
  /* transition: color 0.2s, background-color 0.2s; */
}
.close-btn:hover {
  color: #4b5563;
  background-color: #f3f4f6;
}

/* 文章列表 */
.article-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* 文章项 */
.article-item {
  transition: background-color 0.2s;
}

/* 链接样式 */
.article-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 0.5rem;
  color: #374151;
  transition: background-color 0.2s, color 0.2s;
}
.article-link:hover {
  background-color: #eef2ff;
  color: #4f46e5;
}

.link-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 1rem;
}

.link-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.article-link:hover .link-icon {
  opacity: 1;
}

/* 滚动条样式 */
.article-list::-webkit-scrollbar {
  width: 8px;
}
.article-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}
.article-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
.article-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.chat-sidebar {
  position: relative;
  background-color: #f7f9f9;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ebeef5;
  overflow: visible;
  z-index: 0;
  /* opacity: 0.8; */
}
.collapse-btn {
  position: absolute;
  background-color: white;
  border-color: #ebeef5;
  top: 50%;
  right:-15px;
  height: 50px;
  width: 50px;
  transform: translateY(-50%);
  transform: translateX(20%);
  cursor: pointer;
  z-index: 1;
}
.search-wrapper {
  padding: 16px;
}
.el-input__suffix, .el-input__prefix {
  cursor: pointer;
}
.chat-list {
  flex: 1;
  padding: 8px 0;
  overflow-x: hidden;
}
/* .chat-list:hover{
  background-color:rgb(216.8, 235.6, 255);
} */
.chat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  white-space: nowrap;
}
.chat-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
.chat-name {
  font-weight: 500;
  text-overflow: ellipsis;
  overflow: hidden;
}
.chat-info::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 100%;
  background: linear-gradient(to left, #fafafa, transparent);
  pointer-events: none;
}
.chat-date {
  font-size: 12px;
  color: #909399;
}
.dropdown-trigger {
  cursor: pointer;
  padding: 0 8px;
}
.avatar-wrapper {
  flex-basis: 50px;
  width: 90%;
  margin-left: 5px;
  border-radius: 20px;
  padding:  5px;
}
.avatar-wrapper:hover{
  background-color: rgb(216.8, 235.6, 255);
}
.avatar-wrapper :deep(.el-avatar) {
  cursor: pointer;
}

</style>