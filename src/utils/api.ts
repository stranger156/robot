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