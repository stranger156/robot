<template>
      <el-scrollbar >
      <div v-if="todayList.length" style="margin-bottom: 10px;">
      <h2 style="margin-left: 10px;">今天</h2>
<div :class="item.id==dialogId?'title active':'title'" v-for="item in todayList" @click="selectDialog(item.id)">
   {{ item.content[0].question }}
</div>
   </div>
   <div v-if="yesterdayList.length" style="margin-bottom: 10px;">
      <h2 style="margin-left: 10px;">昨天</h2>
<div :class="item.id==dialogId?'title active':'title'" v-for="item in yesterdayList" @click="selectDialog(item.id)">
   {{ item.content[0].question }}
</div>
   </div>
  <div v-if="otherList.length" style="margin-bottom: 10px;">
      <h2 style="margin-left: 10px;">更早</h2>
<div :class="item.id==dialogId?'title active':'title'" v-for="item in otherList" @click="selectDialog(item.id)">
   {{ item.content[0].question }}
</div>
   </div></el-scrollbar>
</template>

<script  setup >
import axios from 'axios';
import { computed, onMounted, reactive, ref,watch } from 'vue';
import { useDialogStore } from '@/stores/dialogId';
import { getHistory } from '@/utils/api';
const historyList= ref([]);
const todayList =ref([])
const otherList=ref([])
const yesterdayList=ref([])
const dialog=useDialogStore()
const dialogId=ref('')
const id=computed(()=>dialog.dialog.id)
const selectDialog=(id)=>{
   dialog.setDialogInfo(id)
}
// 获取 store 中的 ID（使用 computed 自动响应变化）

const gethistory=async()=>{
   todayList.value=[]
   yesterdayList.value=[]
   otherList.value=[]
   getHistory().then(res=>{
   let list=[]
            Object.keys( res.historys).forEach(key=>{
               let content=[]
            res.historys[key].forEach((value)=>{
               content.push(value)
               })
               list.push({
                  id:key,
                  content:content
               })
            })
            historyList.value=list
            historyList.value.forEach(item=>{
                 const inputDateStr = item.content[0].time.split(' ')[0]; // 获取日期部分
                  const today = new Date();
                  const todayStr = today.toISOString().split('T')[0];
                    const yesterday = new Date(today);
                  yesterday.setDate(yesterday.getDate() - 1);
                     const yesterdayStr = yesterday.toISOString().split('T')[0];
                  if(inputDateStr==todayStr){
                  todayList.value.push(item)
                  }else if(inputDateStr==yesterdayStr){
                     yesterdayList.value.push(item)
                  }else{
                     otherList.value.push(item)
                  }
            })
   })         
}

watch(id, (newId) => {
  dialogId.value=newId;
   let add=true
  historyList.value.forEach(item=>{
   if(item.id===newId){
      add=false
   }
  })
if(add){
   if(newId==='999'){
      gethistory()
   todayList.value.push({
      id:newId,
      content:[{
         question:'新对话',
         answer:''
      }]
   })
   }else{
todayList.value[0].id=newId
   }
}
})
onMounted(()=>{
   gethistory()
   dialogId.value=localStorage.getItem('id')
})

</script>

<style scoped>
.title{
   margin-left: 10px;
   width: 90%;
   height: 50px;
   padding: 10px;
   border-radius: 20px;
   overflow: hidden;
}
.active{
   background-color:rgb(190, 215, 240);
}
.title:hover{
   background-color: rgb(216.8, 235.6, 255);
}
</style>