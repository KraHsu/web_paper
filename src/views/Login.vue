<script setup lang='ts'>
import { ref, reactive, computed, onUnmounted, onMounted } from 'vue';
import useCurrentInstance from "@/utils/useCurrentInstance";
import router from '@/router';
import { ElNotification } from 'element-plus';
import { configs } from '@/config.js';
const { proxy } = useCurrentInstance();

const succ = (t: string, m: string) => {
  ElNotification({
    title: t,
    message: m,
    type: 'success',
    showClose: false,
    duration: 1000
  })
}

const warn = (m: string) => {
  ElNotification({
    title: 'Error!!',
    message: m,
    type: 'error',
    duration: 3000
  })
}
// proxy.$appendJS('./js/login.js')
const State = reactive({
  isSignup: true,
  cont: true,
  card_styl: true,
  diffPWD: false,
  wrongPWD: false,
  signupFail: false
})


const loginData = reactive({
  id: '',
  password: ''
})

const signUpData = reactive({
  id: '',
  password: '',
  Cpassword: '',
  name: ''
})

const login = async () => {
  try {
    const response = await proxy.$post(configs.APIS.User.Login, {
      'username': loginData.id,
      'password': loginData.password
    })
    // if(response.code == 1) 
    if (response.code == 1) {
      localStorage.setItem('access_token', JSON.stringify(response.data))
      localStorage.setItem('user_data', JSON.stringify(response.data))
      router.push('/user')
      succ('欢迎回来！', loginData.id)
    } else {
      State.wrongPWD = true
      warn(response.msg)
    }
  } catch (error) {
    warn(String(error))
    console.log(error)
  }
}

const signUp = async () => {
  if(signUpData.password === signUpData.Cpassword) {
    try {
      const response = await proxy.$post(configs.APIS.User.Register, {
        "username": signUpData.name,
        "password": signUpData.password,
        "id": signUpData.id,
      })

      if (response.code == 1) {
        State.isSignup = false
        succ("提示消息", '注册成功！')
      } else {
        State.signupFail = true
        warn('注册失败！' + response.msg)
      }
    } catch (error) {
      warn(String(error))
      console.log(error)
    }
  } else {
    warn("两次密码不一致!")
    State.diffPWD = true
  }
}
var cont = ref()
onMounted(() => {
  cont.value = document.querySelector("#container .cont")
})
onUnmounted(() => {
  cont.value.classList.add('dis')
})
</script>

<template>
  <main id="container">
    <div :class="State">
      <div class="form login">
        <h2>欢迎回来</h2>
        <label>
          <span>用户名</span>
          <input type="text" placeholder="" v-model="loginData.id" />
        </label>
        <label>
          <span>密码</span>
          <input type="password" placeholder="" v-model="loginData.password" />
        </label>
        <p class="forgot-pass">忘记密码 ?</p>
        <button type="button" class="submit loginbtn" @click="login">登录</button>
        <button type="button" class="fb-btn">联系我们</button>
      </div>
      <div class="sub-cont">
        <div class="img">
          <div class="img_text msg_up">
            <h2>没有账号?</h2>
            <p>使用学号快捷注册!</p>
          </div>
          <div class="img_text msg_in">
            <h2>已有账号?</h2>
            <p>若果您已有账号，请直接点击下方链接登录！</p>
          </div>
          <div class="img_btn" @click="State.isSignup = !State.isSignup">
            <span class="msg_up">注册</span>
            <span class="msg_in">登录</span>
          </div>
        </div>
        <div class="form sign_up">
          <h2 class="registerH">注册</h2>
          <label>
            <span>学号或工号</span>
            <input type="text" placeholder="" v-model="signUpData.id" />
          </label>
          <label>
            <span>用户名</span>
            <input type="text" placeholder="" v-model="signUpData.name" />
          </label>
          <label>
            <span>密码</span>
            <input type="password" placeholder="" v-model="signUpData.password" />
          </label>
          <label>
            <span>确认密码</span>
            <input type="password" placeholder="" v-model="signUpData.Cpassword" />
          </label>
          <button type="button" class="submit signupbtn" @click="signUp">注册</button>
          <button type="button" class="fb-btn">联系我们</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="stylus">
*,
*:before,
*:after
  box-sizing border-box
  margin 0
  padding 0

#container
  position absolute
  top 120px
  width 100%
  height calc(100% - 120px)
  display flex
  align-items center

input,
button
  border none
  outline none
  background none
  font-family "Open Sans", Helvetica, Arial, sans-serif

.tip
  font-size 20px
  margin 40px auto 50px
  text-align center

@keyframes appear
  0%
    opacity 0
    transform translateY(20px)
  100%
    opacity 1
    transform translateY(0)
.cont
  overflow hidden
  position relative
  width 900px
  height 550px
  margin 0 auto 100px
  background #fff
  // animation appear .6s ease
  &.isSignup
    .sub-cont
      transform translate3d(-640px, 0, 0)
    .img
      &:before
        transform translate3d(640px, 0, 0)
    .img_text
      &.msg_up
        transform translateX(520px)
      &.msg_in
        transform translateX(0)
    .img_btn
      span
        &.msg_in
          transform translateY(0)
        &.msg_up
          transform translateY(72px)
    .login
      transition-timing-function ease-in-out
      transition-duration 1.2s
      transform translate3d(640px, 0, 0)
    .sign_up
      transform translate3d(0, 0, 0)

.form
  position relative
  width 640px
  height 100%
  transition transform 1.2s ease-in-out
  padding 50px 30px 0
  &.sign_up
    padding 30px 30px 0

.sub-cont
  overflow hidden
  position absolute
  left 640px
  top 0
  width 900px
  height 100%
  padding-left 260px
  background #fff
  transition transform 1.2s ease-in-out

button
  display block
  margin 0 auto
  width 260px
  height 36px
  border-radius 30px
  color #fff
  font-size 15px
  cursor pointer

.img
  overflow hidden
  z-index 2
  position absolute
  left 0
  top 0
  width 260px
  height 100%
  padding-top 360px
  &:before
    content ""
    position absolute
    right 0
    top 0
    width 900px
    height 100%
    background-image url("https://cdn.krahsu.top/pic/ppt202304191725936.jpg")
    background-size cover
    transition transform 1.2s ease-in-out
  &:after
    content ""
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    background rgba(0, 0, 0, 0.6)

.img_text
  z-index 2
  position absolute
  left 0
  top 50px
  width 100%
  padding 0 20px
  text-align center
  color #fff
  transition transform 1.2s ease-in-out
  h2
    margin-bottom 10px
    font-weight normal
  p
    font-size 14px
    line-height 1.5
  &.msg_in
    transform translateX(-520px)

.img_btn
  overflow hidden
  z-index 2
  position relative
  width 100px
  height 36px
  margin 0 auto
  background transparent
  color #fff
  text-transform uppercase
  font-size 15px
  cursor pointer
  &:after
    content ""
    z-index 2
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    border 2px solid #fff
    border-radius 30px
  span
    position absolute
    left 0
    top 0
    display flex
    justify-content center
    align-items center
    width 100%
    height 100%
    transition transform 1.2s
    &.msg_in
      transform translateY(-72px)

h2
  width 100%
  margin-top 20px
  margin-bottom 70px
  font-size 26px
  text-align center
  &.registerH
    margin-top 0
    margin-bottom 30px
    &~label
      margin-top 10px

.submit.loginbtn
  margin-top 80px

label
  display block
  width 260px
  margin 25px auto 0
  text-align center
  span
    font-size 14px
    color #cfcfcf
    text-transform uppercase

input
  display block
  width 100%
  margin-top 5px
  padding-bottom 5px
  font-size 16px
  border-bottom 1px solid rgba(0, 0, 0, 0.4)
  text-align center

.forgot-pass
  margin-top 15px
  text-align center
  font-size 12px
  color #848484

.submit
  margin-top 40px
  margin-bottom 20px
  background #d4af7a
  text-transform uppercase

.fb-btn
  border 2px solid #d3dae9
  color #8fa1c7
  span
    font-weight bold
    color #455a81

.login
  transition-timing-function ease-out

.sign_up
  transform translate3d(-900px, 0, 0)

[theme='dark'] 
  .sub-cont, .cont
    background #6b6b6b
  input
    border-color white
  .forgot-pass
    color white
  .fb-btn
    color white
</style>