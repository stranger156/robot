<template>
      <el-scrollbar >
      <div v-if="todayList.length" style="margin-bottom: 10px;">
      <h2 style="margin-left: 10px;">今天</h2>
<div :class="item.id==dialogId?'title active':'title'" v-for="item in todayList" @click="selectDialog(item.id)">
  <span> {{ item.content[0].question.slice(0,15) }}</span><span v-show="item.content[0].question.length>15?true:false">...</span>
</div>
   </div>
   <div v-if="yesterdayList.length" style="margin-bottom: 10px;">
      <h2 style="margin-left: 10px;">昨天</h2>
<div :class="item.id==dialogId?'title active':'title'" v-for="item in yesterdayList" @click="selectDialog(item.id)">
 <span> {{ item.content[0].question.slice(0,15) }}</span><span v-show="item.content[0].question.length>15?true:false">...</span>
</div>
   </div>
  <div v-if="otherList.length" style="margin-bottom: 10px;">
      <h2 style="margin-left: 10px;">更早</h2>
<div :class="item.id==dialogId?'title active':'title'" v-for="item in otherList" @click="selectDialog(item.id)">
<span> {{ item.content[0].question.slice(0,15) }}</span><span v-show="item.content[0].question.length>15?true:false">...</span>
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
   console.log(todayList.value)
   yesterdayList.value=[]
   otherList.value=[]
   getHistory().then(res=>{
      console.log(res)
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
   if(newId==='1001'){
      let istrue=true
setTimeout(()=>{
   todayList.value.forEach(item=>{
      if(item.id==='1001'){
         istrue=false
      }
   })
   if(istrue){
  todayList.value.unshift({
      id:newId,
      content:[{
         question:'新对话',
         answer:''
      }]
   })
   }
   },1000)
      return;
   }

  if(dialogId.value==='1000'){
   let ifadd=true
   todayList.value.forEach(item=>{
if(item.id==='1000'||item.id==='1001'){
   ifadd=false
}
   })
   if(ifadd){
gethistory().then(()=>{
 todayList.value.push({
      id:newId,
      content:[{
         question:'新对话',
         answer:''
      }]
   })
      })
   }  
   return ;
  }

   let add=true
  historyList.value.forEach(item=>{
   if(item.id===newId){
      add=false
   }
  })
if(add){
   todayList.value.forEach(item=>{
      if(item.id==='1000'||item.id==='1001'){
         item.id=newId
      }
   })   
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