<template>
  <div class="section home">
    <img src="../assets/home_content.png" alt="" />
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped>
.home{
  width:100%;
  padding-top:112px;
}
.home>img{
  width:100%;
}
</style>
