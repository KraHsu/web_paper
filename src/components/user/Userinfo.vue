<script setup lang='ts'>
import { computed } from 'vue';

const userData = computed(() => {
  return JSON.parse(localStorage.user_data)
})

</script>

<template>
  <main class="user_detail">
    <h2 class="user_name">
      {{ userData.name }}
    </h2>
    <div class="user_infomation">
      <h3 class="email">电子邮箱</h3>
      <p>{{ userData.mail || userData.id + '@bit.edu.cn' }}</p>
    </div>
    <div class="user_infomation">
      <h3 class="class">专业和班级</h3>
      <p>{{ userData.subject || '未知' }} {{ userData.classId }} 班</p>
    </div>
    <div class="user_infomation">
      <h3 class="gender">年龄和性别</h3>
      <p>{{ userData.age || '未知' }} {{ userData.gender }}</p>
    </div>
  </main>
  <aside class="user_info">
    <div class="id">{{ userData.id }}</div>
    <img src="https://cdn.krahsu.top/pic/ppt202304201956844.jpg" alt="" class="user_fav">
    <div class="classID">{{ userData.classId }}班</div>
  </aside>
</template>

<style scoped>
h2{
  margin: 10px;
}
h3{
  font-size: 18px;
  margin: 5px;
}
.user_infomation{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 26px);
  margin-left: 40px;
  width: 100%;
}

h3{
  grid-area: 1 / 1 / 2 / 5;
  padding: 0;
  margin: 0;
}
p{
  margin: 0 0 0 30px;
  grid-area: 2 / 1 / 3 / 5;
}

.user_detail {
  grid-column-start: span 2;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
}

.user_info {
  grid-column-start: span 1;
  position: relative;
  border-radius: 0 8px 8px 0;
  background: linear-gradient(#dE685E, #EE786E);
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  justify-items: center;
  align-items: center;
}

.id {
  grid-row-start: span 1;
  color: white;
  background: rgba(0, 0, 0, 0.2);
  padding: 0 10px;
  border-radius: 10px;
}

.user_fav {
  grid-row-start: span 2;
  width: 70%;
  margin: 0 auto;
  border-radius: 50%;
}

.classID {
  grid-row-start: span 1;
  color: white;
  background: rgba(0, 0, 0, 0.2);
  padding: 0 10px;
  border-radius: 10px;
}
</style>