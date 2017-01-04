<template>
  <div class="section aboutUs">
    <div class="aboutUs-content">
      <div>
        移动端产品，用户为老师、学生、家长。完成老师布置作业练习环节，学生练习，家长查阅。有与学校一体的班级体系，应用对应的教材体系和知识点体系，练习、试卷、消息、口算、汉字、微课视频音频内容进行学习。有对应的班级报告，学生个人报告，单次作业报告等一系列成果展示，针对学生错误有效学习。
        <span class="about-title1"></span>
      </div>
      <div>
        PC端产品，用户为学校，老师，学生。有小初高学段全科的资源，包括试卷、学案、教案、导学案、讲解剖析、教学设计、课后练习、单元练习等丰富内容，提供预览下载功能。
        <span class="about-title2"></span>
      </div>
      <div>
        PC端产品，用于内部教学内容研发，前端产品展示的以上内容均来自月题库后台。通过录入、解析、初审、复审、入库、质检流程，保证所有资源保质保量。全学段全学科题型覆盖，单题试卷录入模式均有。前端产品如何打包重组，内容均方便提供。知识图谱体系和教材体系经过专家反复优化。
        <span class="about-title3"></span>
      </div>
    </div>
    <img src="../assets/about_bottom.png" alt="" />
  </div>
</template>

<script>
export default {
  name: 'aboutUs',
  data () {
    return {
      msg: '关于我们'
    }
  }
}
</script>

<style scoped>
.aboutUs{
  padding-top:80px;
  text-align: center;
}
.aboutUs-content{
  width:650px;
  margin: 0 auto;
  font-size:12px;
  line-height: 24px;
}
.aboutUs-content>div{
  position: relative;
  text-align: left;
  margin-top:60px;
}
.aboutUs-content>div>span{
  display: inline-block;
  position: absolute;
}
.about-title1{
  top:-10px;
  right:-75px;
  width:25px;
  height:120px;
  background: url(../assets/about_title1.png) no-repeat;
  background-size: 100% auto;
}
.about-title2{
  top:-30px;
  left:-75px;
  width:38px;
  height:150px;
  background: url(../assets/about_title2.png) no-repeat;
  background-size: 100% auto;
}
.about-title3{
  top:-40px;
  right:-75px;
  width:38px;
  height:170px;
  background: url(../assets/about_title3.png) no-repeat;
  background-size: 100% auto;
}
.aboutUs>img{
  width:100%;
}
</style>
