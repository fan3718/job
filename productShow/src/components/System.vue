<template>
  <div class="section system">
    <img src="../assets/tiku_content_bg.png" alt="" />
    <div class="tiku-login-page">
      <div class="tiku-login-content">
        <div class="merits">
          <span v-for='(merit, index) in merits' class="tiku-merits" v-bind:index="index" v-html="merit"></span>
        </div>
        <login-box :pageName="1"></login-box>
      </div>
    </div>
  </div>
</template>

<script>
import loginBox from './Loginbox'
export default {
  name: 'system',
  data () {
    return {
      merits: ['内容<br/>流程化', '优质优良', '优质后台数据', '全科覆盖', '知识体系', '公式清晰', '题型全面']
    }
  },
  components: {loginBox}
}
</script>

<style scoped>
.system{
  position: relative;
  text-align: center;
  overflow: hidden;
  background-color: rgb(0,185,251);
  padding:110px 0 170px 10px;
}
.system>img{
  width:754px;
}
.tiku-login-page{
  z-index: 9;
  position: absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
}
.tiku-login-content{
  position: relative;
  width:754px;
  height: 100%;
  margin: 0 auto;
}
.tiku-merits{
  z-index:19;
  display: inline-block;
  width: 120px;
  height: 120px;
  background: url(../assets/merit_circle.png) no-repeat;
  background-size: 100%;
  font-family: 'STXinWei';
  font-size:20px;
  color:#09bbfb;
}
.tiku-merits[index="0"]{
  position: absolute;
  top:90px;
  left:180px;
  width:88px;
  height:88px;
  padding:20px 10px;
}
.tiku-merits[index="1"]{
  position: absolute;
  top:200px;
  left:-20px;
  width:72px;
  height:72px;
  padding:15px 10px;
}
.tiku-merits[index="2"]{
  position: absolute;
  top:140px;
  left:580px;
  width:90px;
  height:90px;
  padding:15px 20px;
}
.tiku-merits[index="3"]{
  position: absolute;
  top:320px;
  left:480px;
  width:72px;
  height:72px;
  padding:15px 10px;
}
.tiku-merits[index="4"]{
  position: absolute;
  top:440px;
  left:250px;
  width:72px;
  height:72px;
  padding:15px 10px;
}
.tiku-merits[index="5"]{
  position: absolute;
  top:480px;
  left:30px;
  width:72px;
  height:72px;
  padding:15px 10px;
}
.tiku-merits[index="6"]{
  position: absolute;
  top:460px;
  left:650px;
  width:72px;
  height:72px;
  padding:15px 10px;
}
</style>
