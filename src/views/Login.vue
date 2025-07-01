<template>
  <div class="out">
   <h1 style="text-align: center;color: white;font-size: 50px;">金盾智语——智能防诈骗客服</h1>
  <div class="container" :class="{ 'right-panel-active': isRegisterActive }" id="login-box">
    <!-- 注册表单 --> 
    <div class="form-container sign-up-container">
      <form @submit.prevent="handleRegister">
        <h1>注册</h1>
        <div class="txtb">
          <input type="text" v-model="registerForm.userName" required>
          <span data-placeholder="Username"></span>
        </div>
        <div class="txtb">
          <input type="phone" v-model="registerForm.phoneNumber" required>
          <span data-placeholder="Phonenumber"></span>
        </div>
        <div class="txtb">
          <input type="password" v-model="registerForm.password" required>
          <span data-placeholder="Password"></span>
        </div>
        <div class="txtb">
          <input type="password" v-model="registerForm.confirmPassword" required>
          <span data-placeholder="Confirm Password"></span>
        </div>
        <button type="submit">注册</button>
      </form>
    </div>

    <!-- 登录表单 -->
    <div class="form-container sign-in-container">
      <form @submit.prevent="handleLogin">
        <h1>登录</h1>
        <div class="txtb">
          <input type="phone" v-model="loginForm.phone" required>
          <span data-placeholder="Phone"></span>
        </div>
        <div class="txtb">
          <input type="password" v-model="loginForm.password" required>
          <span data-placeholder="Password"></span>
        </div>
        <a href="#">忘记密码？</a>
        <button type="submit" >登录</button>
      </form>
    </div>

    <!-- 覆盖层 -->
    <div class="overlay-container">
      <div class="overlay">
        <div class="overlay-panel overlay-left">
          <h1>已有账号？</h1>
          <p>请使用您的账号进行登录</p>
          <button class="ghost" @click="togglePanel(false)">登录</button>
        </div>
        <div class="overlay-panel overlay-right">
          <h1>没有账号?</h1>
          <p>立即注册加入我们，和我们一起开始旅程吧</p>
          <button class="ghost" @click="togglePanel(true)">注册</button>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import {login, register} from '../utils/api.ts'
import { useRouter } from 'vue-router'
 import { useUserStore } from '@/stores/token.ts';
 const user=useUserStore()
    const isRegisterActive = ref(false)
    const router=useRouter()
    const loginForm = ref({
      phone: '',
      password: ''
    })
    
    const registerForm = ref({
      userName: '',
      phoneNumber: '',
      password: '',
      confirmPassword: ''
    })

    const togglePanel = (isActive) => {
      isRegisterActive.value = isActive
    }

    const handleLogin = () => {
      console.log(loginForm.value)
     login(loginForm.value).then(res=>{
      console.log(res)
      if(res.code===200){
        user.setLoginInfo(res.token)
    router.push('Menu')
      }
     })
      // 这里添加登录API调用
    }
    const handleRegister = () => {
      if (registerForm.value.password !== registerForm.value.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }
      console.log('注册数据:', registerForm.value)
      register(registerForm.value).then(res=>{
        if(res.code===200){
           ElMessage({
    message: '注册成功',
    type: 'success',
  })
  registerForm.value=[]
        }
      })
      // 这里添加注册API调用
    }

    // 初始化输入框焦点效果
    const initInputEffects = () => {
      const inputs = document.querySelectorAll('.txtb input')
      inputs.forEach(input => {
        input.addEventListener('focus', function() {
          this.classList.add('focus')
        })
        input.addEventListener('blur', function() {
          if (this.value === '') {
            this.classList.remove('focus')
          }
        })
      })
    }

    // 在组件挂载后初始化效果
    onMounted(() => {
      initInputEffects()
    })



</script>

<style scoped>
/* 保持原有的CSS不变 */
* {
    box-sizing: border-box;
}
.out{
    position: relative;
    height: 100vh;
    padding: 80px;
    width:100vw;
    background-image: url("../image/bg.gif");
    background-size: cover;
}
body {
    font-family: 'Montserrat',sans-serif;
    background-image: linear-gradient(120deg,#3498db,#8e44ad);;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: -20px 0 50px;
}

h1 {
    font-weight: bold;
    margin: 0;
}
p {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: .5px;
    margin: 20px 0 30px;
}
span {
    font-size: 12px;
}
a {
    color: #333;
    font-size: 14px;
    text-decoration: none;
    margin: 15px 0;
}
.container {
margin-top:80px;
margin-left: 300px;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .22);
    position: absolute;
    overflow: hidden;
    align-items: center;
    width: 768px;
    max-width: 100%;
    min-height: 480px;   
}
.form-container form {
    background: #fff;
    display: flex;
    flex-direction: column;
    padding: 0 50px;
    height: 100%;
    justify-content: center;
    text-align: center;
}
.social-container {
    margin: 20px 0;
}

.social-container a {
    border: 1px solid #ddd;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
    height: 40px;
    width: 40px;
}

.social-container a:hover {
    background-color: #eee;
}

.txtb {
    border-bottom: 2px solid #adadad;
    position: relative;
    margin: 10px 0;
}

.txtb input {
    font-size: 15px;
    color: #333;
    border: none;
    width: 100%;
    outline: none;
    background: none;
    padding: 0 3px;
    height: 35px;
}

.txtb span::before {
    content: attr(data-placeholder);
    position: absolute;
    top: 50%;
    left: 5px;
    color: #adadad;
    transform: translateY(-50%);
    transition: .5s;
}
.txtb span::after {
    content: '';
    position: absolute;
    left: 0%;
    top: 100%;
    width: 0%;
    height: 2px;
    background-image: linear-gradient(120deg,#3498db,#8e44ad);
    transition: .5s;
}

.focus + span::before {
    top: -5px;
}

.focus + span::after {
    width: 100%;
}

button {
    border-radius: 20px;
    border: 1px solid #ff4b2b;
    background: #ff4b2b;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    cursor: pointer;
}

button:active {
    transform: scale(.95);
}

button:focus {
    outline: none;
}

button.ghost {
    background: transparent;
    border-color: #fff;
}

.form-container {
    position: absolute;
    top: 0;
    height: 100%;
    transition: all .6s ease-in-out;
}

.form-container button {
    background: linear-gradient(120deg, #3498db, #8e44ad);
    border: none;
    background-size: 200%;
    color: #fff;
    transition: .5s;
}

.form-container button:hover {
    background-position: right;
}

.sign-in-container {
    left: 0;
    width: 50%;
    z-index: 2;
}
.sign-in-container form a {
    position: relative;
    left: 100px;
}
.sign-up-container {
    left: 0;
    width: 50%;
    z-index: 1;
    opacity: 0;
}
.sign-up-container button {
    margin-top: 20px;
}
.overlay-container {
    position:absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform .6s ease-in-out;
    z-index: 100;
}
.overlay {
    background-image: linear-gradient(120deg,#3498db,#8e44ad);
    color: #fff;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateY(0);
    transition: transform .6s ease-in-out;
}
.overlay-panel {
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 40px;
    height: 100%;
    width: 50%;
    text-align: center;
    transform: translateY(0);
    transition: transform .6s ease-in-out;
}
.overlay-right {
    right: 0;
    transform: translateY(0);
    
}

.overlay-left {
    transform: translateY(-20%);
}

.container.right-panel-active .sign-in-container {
    transform: translateY(100%);
}

.container.container.right-panel-active .overlay-container {
    transform: translateX(-100%);
}
.container.right-panel-active .sign-up-container {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
}
.container.container.right-panel-active .overlay {
    transform: translateX(50%);
}
.container.container.right-panel-active .overlay-left {
    transform: translateY(0);
}
.container.container.right-panel-active .overlay-right {
    transform: translateY(20%);
}
</style>