<template>
  <div class="section resource">
    <div class="resource-login-page">
      <div class="resource-login-content">
        <div>
          <div class="resource-sort" v-bind:index="index" v-for="(R,index) in resourceStage">
            {{R.stage}}
            <span v-bind:num="num" v-for="(item,num) in R.list">{{item}}</span>
          </div>
        </div>
        <div class="resource-right">
          <div class="resource-merit" v-for="merit in resourceMerits">
            <div class="merit-title">{{merit.title}}</div>
            <div class="merit-content">{{merit.content}}</div>
          </div>
        </div>
        <login-box :pageName="0"></login-box>
      </div>
    </div>
  </div>
</template>

<script>
import loginBox from './Loginbox'
export default {
  name: 'resource',
  data () {
    return {
      resourceStage: [{stage: '小学', list: ['课前辅导', '预习导航', '课堂深究']}, {stage: '初中', list: ['专题', '知识点', '综合能力']}, {stage: '高中', list: ['教学设计', '示范教案', '课堂讲解']}],
      resourceMerits: [{title: '全面', content: '教学学科全覆盖，节省您的每一秒'}, {title: '精品', content: '优质教学内容，给你提供更好的教学资源'}, {title: '专注', content: '将教育做到极致，让教学更容易'}],
      msg: '资源'
    }
  },
  components: {loginBox}
}
</script>

<style scoped>
.resource{
  position: relative;
  overflow: hidden;
  height:640px;
  background: url(../assets/resource_bg.png);
}
.resource-login-page{
  z-index: 8;
  position: absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background: url(../assets/resource_top.png) 0 -55px no-repeat;
  background-size: 100%;
}
.resource-sort{
  position: absolute;
  color:#00b9fc;
  font-size:24px;
  font-family: "STXinwei";
}
.resource-sort>span{
  position: absolute;
  font-size:10px;
  font-family: "MicrosoftYaHei";
}
.resource-sort[index="0"]{
  top:120px;
  left:120px;
  width:120px;
  height:80px;
  padding-top:28px;
  padding-left:5px;
  background: url(../assets/resource_stage.png) no-repeat;
  background-size: 100%;
}
.resource-sort[index="0"]>span[num="0"]{
  top:0;
  left:31px;
}
.resource-sort[index="0"]>span[num="1"]{
  top:30px;
  left:66px;
}
.resource-sort[index="0"]>span[num="2"]{
  top:62px;
  left:56px;
}
.resource-sort[index="1"]{
  top:520px;
  left:360px;
  width:130px;
  height:95px;
  padding-top:38px;
  padding-left:10px;
  background: url(../assets/resource_stage1.png) no-repeat;
  background-size: 100%;
}
.resource-sort[index="1"]>span[num="0"]{
  top:0;
  left:46px;
}
.resource-sort[index="1"]>span[num="1"]{
  top:38px;
  left:84px;
}
.resource-sort[index="1"]>span[num="2"]{
  top:76px;
  left:64px;
}
.resource-sort[index="2"]{
  top:400px;
  left:10px;
  width:140px;
  height:100px;
  padding-top:42px;
  padding-left:12px;
  background: url(../assets/resource_stage2.png) no-repeat;
  background-size: 100%;
}
.resource-sort[index="2"]>span[num="0"]{
  top:0;
  left:44px;
}
.resource-sort[index="2"]>span[num="1"]{
  top:42px;
  left:88px;
}
.resource-sort[index="2"]>span[num="2"]{
  top:83px;
  left:70px;
}
.resource-right{
  position: absolute;
  top:200px;
  right:0;
}
.resource-merit{
  margin-bottom:4px
}
.merit-title{
  width:110px;
  height:30px;
  line-height: 30px;
  padding-left:28px;
  font-size:20px;
  color:#00b9fc;
  background: url(../assets/merit_title.png) no-repeat;
  background-size: 85px;
}
.merit-content{
  padding:14px 0 14px 28px;
  color:#fff;
}
.resource-login-content{
  position: relative;
  width:754px;
  height: 100%;
  margin: 0 auto;
}
</style>
