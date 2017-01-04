<template>
<div class="login-box">
  <div class="animation-circle">
    <span v-for="num in 5" v-bind:num="num"></span>
  </div>
  <div class="login-form">
    <div class="login-title">用户登录</div>
    <div class="login-input">
      <i v-if="userName.length>0" v-on:click="userName=''"></i>
      <input type="text" maxLength='18' name="username" placeholder="输入用户名" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" v-model="userName">
    </div>
    <div class="login-input">
      <i v-if="passWord.length>0" v-on:click="passWord=''"></i>
      <input v-if="!remembered" maxLength='11' type="text" name="password" placeholder="输入密码" onfocus="this.type='password'" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" v-model="passWord">
      <input v-if="remembered" maxLength='11' type="password" name="password" placeholder="输入密码" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" v-model="passWord">
    </div>
    <div class="remember-password">
      <input type="checkbox" id="checkbox" v-model="checked" v-on:click="changeChecked" name="name" value="">
      <label for="checkbox">记住密码</label>
    </div>
    <div class="login-btn" v-on:click="login">登&nbsp; 录</div>
  </div>
  <div class="login-alert" v-bind:class="{'none': !isError}">
    <div class="alert-content">
      <div class="alert-text">{{errorInfo}}</div>
      <div class="alert-btn" v-on:click="close">确定</div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'loginBox',
  data () {
    return {
      userName: '',
      passWord: '',
      remembered: window.sessionStorage.getItem('remembered_resource') || false,
      checked: window.sessionStorage.getItem('remembered_resource') || false,
      isError: false,
      errorInfo: '账号或密码错误'
    }
  },
  props: ['pageName'],
  methods: {
    changeChecked: function () {
      var remName = 'remembered_resource'
      if (this.pageName !== '0') {
        remName = 'remembered_system'
      }
      if (!this.checked) {
        window.sessionStorage.setItem(remName, true)
      } else {
        window.sessionStorage.removeItem(remName)
      }
    },
    close: function () {
      this.isError = false
    },
    login: function () {
      if (this.userName.trim() === '') {
        this.errorInfo = '请输入用户名'
        this.isError = true
        return false
      }
      if (this.passWord.trim() === '') {
        this.errorInfo = '请输入密码'
        this.isError = true
        return false
      }
      var data = {
        'username': this.userName,
        'password': this.passWord
      }
      var url = '/accounts/api/v1/login/'
      var hrefUrl = ''
      if (this.pageName !== '0') {
        url = '/accounts/api/v1/login/'
        hrefUrl = '#'
      }
      this.$http({url: url, data: data, method: 'POST'}).then(function (res) {
        if (res.status === 200) {
          this.errorInfo = ''
          window.location = hrefUrl
        } else {
          this.errorInfo = '账号或密码错误'
          this.isError = true
        }
      }, function (response) {
        this.errorInfo = '账号或密码错误'
        this.isError = true
      })
    }
  }
}
</script>

<style scoped>
.none{
  display: none;
}
.login-alert{
  z-index:999;
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  padding-top:250px;
}
.alert-content{
  width:300px;
  height:150px;
  margin:0 auto;
  padding-bottom:10px;
  background-color: #fff;
  border-radius:6px;
}
.alert-text{
  color:#1696ea;
  font-size:24px;
  line-height: 100px;
}
.alert-btn{
  width:60px;
  height:30px;
  line-height: 30px;
  margin: 0 auto;
  color:#fff;
  background-color:#1696ea;
  border-radius:4px;
  cursor:pointer;
}
.login-box{
  position: absolute;
  top:220px;
  width:235px;
  height:235px;
  margin-left:140px;
  background-color: rgb(230,248,255);
  border:1px solid #fff;
  border-radius:118px;
  text-align: center;
}
.system .login-box{
  top:180px;
  margin-left:240px;
}
.login-form{
  z-index:99;
  position: relative;
  color:#bebebf;
}
.login-title{
  font-size:16px;
  color:#1696ea;
  margin-top:30px;
}
.login-input{
  position: relative;
}
.login-input>i{
  position: absolute;
  right:40px;
  bottom:5px;
  width:14px;
  height:14px;
  background: url(../assets/close.png) no-repeat;
  background-size: 100%;
  cursor:pointer;
}
.login-input>input{
  width:175px;
  height: 25px;
  margin-top:13px;
  padding:2px 30px 2px 16px;
  border:1px solid #55b4f0;
  border-radius: 13px;
  background-color: transparent;
}
.login-input>input:focus{
  border:1px solid #55b4f0;
  border-radius: 13px;
}
input:-webkit-autofill {
  background-color: transparent!important;
  background-image: none!important;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
}
.remember-password{
  font-size:12px;
  margin:10px 0 15px;
}
.remember-password>input{
  display: none;
}
.remember-password>input+label{
  cursor:pointer;
  padding-left:18px;
  background: url(../assets/dis_remember.png) 0 1px no-repeat;
  background-size: 12px;
}
.remember-password>input:checked+label{
  padding-left:18px;
  background: url(../assets/remember_me.png) 0 1px no-repeat;
  background-size: 12px;
}
.login-btn{
  width: 175px;
  height: 25px;
  line-height:25px;
  background-color: #1696ea;
  color:#fff;
  font-size:12px;
  border-radius: 13px;
  margin:0 auto;
  cursor:pointer;
}
.animation-circle>span{
  opacity: 0;
  position: absolute;
  top:30px;
  left:170px;
  display: inline-block;
  width: 285px;
  height: 285px;
  background: url(../assets/animation_circle.png) no-repeat;
  background-size: 100%;
  /*animation: circle 3.2s linear infinite;*/
  transform: translate3d(-77%,-15%,0);
}
.system .animation-circle>span{
  top:54px;
  left:118px;
  transform: translate3d(-50%,-20%,0);
}
.animation-circle>span[num="2"]{
  animation-delay: 0.8s;
}
.animation-circle>span[num="3"]{
  animation-delay: 1.6s;
}
.animation-circle>span[num="4"]{
  animation-delay: 2.4s;
}
.animation-circle>span[num="5"]{
  animation-delay: 3.2s;
}
@keyframes circle {
  0%{
    opacity: 1;
  }
  100%{
    opacity: 0;
    width:1000px;
    height:1000px;
  }
}
</style>
