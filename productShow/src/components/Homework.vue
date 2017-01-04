<template>
  <div class="section homeWork">
    <img src="../assets/homeWork_content.png" alt="" />
    <div class="download-style">
      <div class="download-btn">IOS下载</div><br/>
      <div class="download-btn">安卓下载</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'homeWork',
  data () {
    return {
      msg: '作业'
    }
  }
}
</script>

<style scoped>
.homeWork{
  position: relative;
  padding-top:108px;
  text-align: center;
}
.homeWork>img{
  width:678px;
  margin-right:65px;
}
.download-style{
  z-index: 9;
  display: inline-block;
  width:150px;
  position: absolute; 
  top:450px;
  left:50%;
  padding-left:120px;
}
.download-btn{
  display: inline-block;
  width:150px;
  height: 40px;
  border-radius:20px;
  border:2px solid #4791c0;
  line-height: 38px;
  font-size:18px;
  font-weight:bold;
  margin-bottom:20px;
  cursor: pointer;
}
</style>
