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
export const getHistory =()=>{
  return $http(
        {
            url:"/getHistory",
            method:"get",
        })
}
 
 export const getUser =()=>{
  return $http(
        {
            url:"/getUserInfo",
            method:"get",
        })
}
 export const getAnswer =(data:any)=>{
  return $http(
        {
            url:"/api/chat",
            method:"post",
            data
        })
}

 export const  getText=(data:any)=>{
  return $http(
        {
            url:"/api/yuyinshibie",
            method:"post",
            data,
            headers: { 'Content-Type': 'multipart/form-data'  }
        })
}
 export const readText=(data:any)=>{
  return $http(
        {
            url:"/api/vits",
            method:"post",
            data,
            headers: { 'Content-Type': 'multipart/form-data'  },
			responseType: 'blob'
        })
}
 export const chat=(data:any)=>{
  return $http(
        {
            url:"/api/full_process",
            method:"post",
            data,
            headers: { 'Content-Type': 'multipart/form-data'  }
        })
}
