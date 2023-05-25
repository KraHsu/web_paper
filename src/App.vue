<script setup lang="ts">
import { onMounted, watch } from 'vue';
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
</script>
<template>
  <Header></Header>
  <RouterView v-slot="{ Component }">
    <Transition>
      <component :is="Component"></component>
    </Transition>
  </RouterView>
</template>

<style scoped lang="stylus">

</style>
