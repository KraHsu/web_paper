<script setup lang='ts'>
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus'
import search from '@/components/icons/search.vue'
import person from '@/components/icons/person.vue'
import logout from '@/components/icons/logout.vue'
import theme_button from '@/components/icons/theme_button.vue';
import list_setting from './icons/list_setting.vue';
import bell from './icons/bell.vue';
import { computed, onMounted, ref } from 'vue';
const router = useRouter()

const User = computed(() => {
  return useRoute().path.includes('/user')
})

const logOut = () => {
  ElMessageBox.confirm(
    '确认退出登录吗？',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '成功退出！',
      })
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_data')
      router.push('/')
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消退出',
      })
    })
}

const scroll = ref(false)

onMounted(() => {
  window.addEventListener("scroll", function () {
    window.pageYOffset === 0 ? scroll.value = false : scroll.value = true
  });
})

</script>

<template>
  <header id="header" :class="{ scroll: scroll }">
    <div class="header_container">
      <section class="site_info">
        <div class="site_console_button">
          <list_setting @click="$emit('drawerappear')"/>
        </div>
        <RouterLink to="/" class="site_name">论文归档</RouterLink>
      </section>
      <section class="nav_mask"></section>
      <section class="menus"></section>
      <section class="nav_icons">
        <RouterLink to="search">
          <search class="icon" />
        </RouterLink>
        <RouterLink to="msg">
          <bell class="icon" />
        </RouterLink>
        <Transition name="fade">
          <a v-if="User" href="javascript:void(0);" class="user_icon">
            <logout class="icon" @click="logOut"></logout>
          </a>
          <RouterLink v-else to="user" class="user_icon">
            <person class="icon" />
          </RouterLink>
        </Transition>
        <a href="javascript:void(0);">
          <theme_button class="icon" />
        </a>
      </section>
    </div>
  </header>
</template>

<style scoped lang="stylus">
header
  backdrop-filter: blur(5px)
  z-index: 3
  transition: box-shadow .3s
  &.scroll
    box-shadow: 6px 6px 10px #0000001a
.user_icon.fade-enter-active{
  margin-left: -42px;
}

</style>