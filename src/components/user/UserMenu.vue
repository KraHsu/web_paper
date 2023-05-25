<script setup lang='ts'>
import { computed } from 'vue';
import router from '@/router';
import generateReverseDictionary from '@/utils/ReverseDictionary.js';
const Transfer: Record<string, string> = {
  "1-1": "message",
  "1-2": "announcement",
  "2": "personaldata",
  "3": "papers",
};
const handleOpen = (e: {index: string}) => {
  router.push('/user/' + Transfer[e.index]);
};
const index = computed(() => {
  const RTransfer: Record<string, string> = generateReverseDictionary(Transfer);
  const path = router.currentRoute.value.fullPath.replace('/user', '').replace("/", "");
  const index = RTransfer[path] || "3"
  // console.table({RTransfer, path, index});
  return  index;
})
</script>

<template>
  <el-menu :default-active="index" class="user-menu">
    <el-sub-menu index="1">
      <template #title>
        <span>消息</span>
      </template>
        <el-menu-item index="1-1" @click="handleOpen">我的消息</el-menu-item>
        <el-menu-item index="1-2" @click="handleOpen">通知公告</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="2" @click="handleOpen">
      <span>编辑个人资料</span>
    </el-menu-item>
    <el-menu-item index="3" @click="handleOpen">
      <span>我的论文</span>
    </el-menu-item>
    <el-menu-item index="4" disabled>
      <span>偏好设置</span>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>
.el-menu.el-menu--vertical{
  background: transparent;
}
.user-menu{
  border: none;
  border-radius: 15px;
}
</style>