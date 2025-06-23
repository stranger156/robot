import { defineStore } from "pinia";
export const useDialogStore =defineStore('dialog',{
    state(){
        return{           
            dialog:{ 
                id:localStorage.getItem('id')||'',
                newId:localStorage.getItem('newId')||'',
                newQuestion:localStorage.getItem(' newQuestion')||''
            }
         }
        // user:"blank"
     },
     actions:{
        setDialogInfo(id:any){
            localStorage.setItem("id",id);
            this.dialog.id=id
        },
        setNew(id:any,question:any){
            localStorage.setItem("newId",id)
              localStorage.setItem("newQuestion",question)
              this.dialog.newId=id
              this.dialog.newQuestion=question

        }
     }
})