<template>
  <div id="app">
    <div class="container" v-bind:class="bgClassName" >
      <div class="tab-menu">
        <div class="tab-content">
          <div class="web-logo">{{webPageName}}</div>
          <div class="tab" v-on:click="changeTab">
            <span v-for="item in menu" v-bind:class="{ 'active': currentView == item.name}" :type="item.name">
              {{item.text}}<em>{{item.name}}</em>
            </span>
          </div>
        </div>
      </div>
      <component :is="currentView"></component>
    </div>
  </div>
</template>

<script>
import Home from './components/Home'
import Homework from './components/Homework'
import Resources from './components/Resources'
import System from './components/System'
import Aboutus from './components/Aboutus'

export default {
  name: 'app',
  data () {
    return {
      bgClassName: 'bgStyle',
      webPageName: 'XX网',
      menu: [{name: 'Home', text: '首页'}, {name: 'Homework', text: '作业'}, {name: 'Resources', text: '资源'}, {name: 'System', text: '题库后台'}, {name: 'Aboutus', text: '关于我们'}],
      currentView: 'Home',
      data: ''
    }
  },
  methods: {
    changeTab: function (event) {
      switch (event.target.getAttribute('type')) {
        case 'Home':
          if (this.currentView !== 'Home') {
            this.currentView = 'Home'
            this.bgClassName = 'bgStyle'
          }
          break
        case 'Homework':
          if (this.currentView !== 'Homework') {
            this.currentView = 'Homework'
            this.bgClassName = ''
          }
          break
        case 'Resources':
          if (this.currentView !== 'Resources') {
            this.currentView = 'Resources'
            this.bgClassName = ''
          }
          break
        case 'System':
          if (this.currentView !== 'System') {
            this.currentView = 'System'
            this.bgClassName = 'bgStyle'
          }
          break
        case 'Aboutus':
          if (this.currentView !== 'Aboutus') {
            this.currentView = 'Aboutus'
            this.bgClassName = 'bgStyle aboutBg'
          }
          break
      }
    }
  },
  components: {
    Home,
    Homework,
    Resources,
    System,
    Aboutus
  }
}
</script>

<style>
*{
  padding: 0;
  margin: 0;
  box-sizing:border-box;
  outline: medium none;
  -webkit-box-sizing:border-box;
  -moz-box-sizing:border-box;
  -ms-box-sizing:border-box;
  -o-box-sizing:border-box;
}
body,html{
  font-family: 'MicrosoftYaHei';
}
.container{
  width:100%;
  min-width:1200px;
  font-size:14px;
  color: rgb(71,145,192);
}
.tab-menu{
  z-index:9;
  position: relative;
  height:77px;
  width:100%;
  padding-top:36px;
  line-height: 38px;
  border-bottom:1px solid #4791c0;
}
.tab-content{
  width:960px;
  margin: 0 auto;
}
.web-logo{
  float: left;
  margin-left:120px;
  font-size: 22px;
  letter-spacing: 6px;
}
.tab{
  float: right;
}
.tab span{
  position: relative;
  cursor:pointer;
  display: inline-block;
  width:120px;
  text-align: center;
  border:1px solid transparent;
}
.tab span>em{
  position: absolute;
  font-style: normal;
  display: none;
  width:100%;
  height: 4px;
  left: 0;
  bottom: -4px;
  line-height: 0;
  font-size:10px;
  background-color: #fff;
}
.tab span.active{
  cursor: default;
  border-color:#4791c0;
  border-top-left-radius:6px;
  border-top-right-radius:6px;
}
.tab span.active>em{
  display: inline-block;
}
.bgStyle{
  color: #f5fcfe;
  background-color: rgb(0, 185, 251);
}
.bgStyle .tab-menu{
  border-color:#f5fcfe;
}
.bgStyle .tab span.active{
  border-color:#f5fcfe;
}
.bgStyle .tab span.active>em{
  background-color: rgb(0, 185, 251);
}
.aboutBg{
  color: #f5fcfe;
  background: url(./assets/about_bg.png);
}
</style>
