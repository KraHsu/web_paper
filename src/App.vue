<script setup lang="ts">
import { onMounted, watch, ref } from 'vue';
import { RouterLink, RouterView, routerKey } from 'vue-router'
import Header from './components/Header.vue';
import { ElNotification } from 'element-plus';
const open = () => {
  ElNotification({
    title: '请自重！',
    message: '开发者模式已打开',
    type: 'warning',
    showClose: false,
    duration: 3000
  })
}

onMounted(() => {
  window.onkeydown = function (e) {
    e.key === 'F12' && open()
  }
})

const drawer = ref(false);
const light = ref(true);

const changeLight = (val: any) => {
  document.body.setAttribute('Theme', val ? 'light' : 'dark');
  document.documentElement.className = val ? 'light' : 'dark';
}

</script>
<template>
  <Header @drawerappear="drawer = true"></Header>
  <RouterView v-slot="{ Component }">
    <Transition>
      <component :is="Component"></component>
    </Transition>
  </RouterView>
  <el-drawer v-model="drawer" title="设 置" direction="ltr" size="350" modal-class="drawer_modal">
    <el-switch @change="changeLight" v-model="light" active-text="Light" inactive-text="Dark"/><br><br>
    无障碍模式 <el-switch @change="changeLight" disabled/><br><br>
    快捷键 <el-switch @change="changeLight" disabled/><br><br>
  </el-drawer>
</template>

<style>
#app{
  height: 100vh;
}
.footer-container{
  position: relative;
  bottom: 0;
}
.drawer_modal{
  background-color: var(--mask-bg);
  backdrop-filter: blur(5px);
}
.beian{
  display: block;
  width: 100%;
  text-align: center;
  text-decoration: none;
  color: var(--font-disabled-color);
  margin-bottom: 15px;
  position: absolute;
  bottom: 0;
}
</style>
