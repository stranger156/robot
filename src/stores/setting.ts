import { defineStore } from "pinia";
export const useSettingStore =defineStore('setting',{
    state(){
        return{           
            setting:{ 
                gender:localStorage.getItem('gender')||'male',
            }
         }
        // user:"blank"
     },
     actions:{
        setSettingInfo(gender:any){
            localStorage.setItem("gender",gender);
            this.setting.gender=gender
        }
     }
})