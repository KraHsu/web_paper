<script setup lang='ts'>
import './PaperStatus.styl';
</script>

<template>
  <section class="paper_status_container">
    <header class="paper_status_header">
      <h1 class="paper_status_headline">我 的 论 文</h1>
      <hr>
    </header>
    <article class="grid_container">
      <el-empty :image-size="200" description="暂时没有论文" />
    </article>
  </section>
</template>

<style scoped></style>