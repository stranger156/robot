import $http from "./request"
// 用户类
// 普通用户登录
export const login =(params:any)=>
    $http(
        {
            url:"/login",
            method:"post",
            data: {
                phoneNumber: params.phone,
                password: params.password
              }
        })
export const register=(params:any)=>  $http(
        {
            url:"/signUp",
            method:"post",
            data: {
                phoneNumber: params.phoneNumber,
                password: params.password,
                userName:params.userName
              }
        })
export const getHistory =(token:any)=>{
    console.log(token)
  return $http(
        {
            url:"/getHistory",
            method:"get",
        })
}
 

 