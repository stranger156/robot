import { defineStore } from "pinia";
export const useUserStore =defineStore('user',{
    state(){
        return{           
            user:{ 
                token:localStorage.getItem('token')||'',
       
            }
         }
        // user:"blank"
     },
     actions:{
        setLoginInfo(token:any,username:any){
            localStorage.setItem("token",token);
           
            this.user.token=token;
     
        }
     }
})