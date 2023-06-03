<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import PaperStatus from '@/components/user/PaperStatus.vue';
onMounted(() => {
  console.log(`⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢠⣤⣤⣄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣤⡄⢀⣠⡀⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣤⣤⣤⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢸⣿⣿⣿⣀⣤⣄⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢀⣀⣤⣤⣄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣿⢰⡀⡿⣿⢀⣿⡟⠁⠄
⠄⠄⠄⠄⢸⣷⣶⣦⠄⢀⣿⣿⣿⠇⠄⠄⠄⠄⠄⢀⣀⣠⣤⣤⣶⣿⣿⠿⠿⠟⠻⠃⠄⠄⠄⠄⠄⣀⣠⣴⣶⡆⣶⣶⢾⣿⡟⣻⣿⡿⠂⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢀⣀⣤⣤⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣶⣾⣦⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⣿⢸⣷⣶⡏⢿⣿⢃⡀⠄
⠄⠄⠄⣀⣸⣿⣿⠋⠄⢸⣿⣿⣿⣾⣷⠄⠄⠄⠄⠘⠟⠛⣛⣉⣉⣤⣴⣶⣦⠄⠄⠄⠄⠄⠄⠄⠘⠿⣿⣿⡟⠁⣿⣿⢾⣿⢻⣿⡟⠁⠄⠄⠄⠄⠄⠄⠄⠄⣿⣿⣿⣿⣿⡿⠟⠁⠄⠄⠄⠄⠄⠄⠄⢀⣀⣠⣿⣿⣷⣾⣿⡿⠆⠄⠄⠄⠄⠄⣴⣧⣽⣬⠶⠾⢿⡟⣻⣿⣿⡇
⠄⢰⣿⣿⣿⣿⣿⠄⠄⣾⣿⣿⠟⠋⠁⠄⠄⠄⠄⠄⠄⠄⣿⣿⡟⣋⣿⣿⠟⠄⠄⠄⠄⠄⠄⠄⢀⣠⣿⣿⣧⠄⣿⣿⣾⣿⣿⡿⠁⠄⠄⠄⠄⠄⠄⠄⠄⠄⠙⢻⣿⣿⣿⠄⠄⠄⠄⠄⠄⠄⠄⠄⠰⢿⣿⣿⣿⣿⡟⠉⠁⠄⠄⠄⠄⠄⠄⠄⣿⡿⢉⣶⣶⣾⣿⠟⠉⠉⠉⠄
⠄⠄⠉⢹⣿⣿⣿⠄⠄⣿⣿⣿⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⢻⣿⣿⣿⡿⢏⣀⠄⠄⠄⠄⠄⠄⠄⠈⣿⣿⣿⣁⠄⢈⣭⣿⣿⣶⡆⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢀⣼⣿⣿⣇⣀⣀⣀⠄⠄⠄⠄⠄⠄⠄⠄⣠⣿⣿⠿⣿⣦⡀⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⣉⣿⣿⣧⣶⣤⠄⠄⠄
⢀⣠⣴⣾⣿⡟⠋⠄⠄⢿⣿⣿⣷⣶⣶⠄⠄⠄⠄⠄⣤⣀⡀⠉⣽⣿⡇⠘⣿⣿⡦⠄⠄⠄⠄⢠⣶⣿⣿⣿⠟⣀⣨⣽⣿⣿⣯⣥⣴⡄⠄⠄⠄⢀⣤⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣷⠄⠄⠄⠄⠄⣠⣴⣿⡿⠃⠄⠙⢿⣷⣦⣀⠄⠄⠄⠄⠄⠄⢾⡿⠿⢿⣿⡟⠋⠉⠄⠄⠄
⠘⠿⠟⠉⠄⠄⠄⠄⠄⠈⠉⠙⠛⠛⠋⠄⠄⠄⠄⠸⡿⠿⠱⢤⣿⣿⠇⠄⠘⠛⠁⠄⠄⠄⠄⠘⠿⠋⠉⠄⠄⠿⠛⠛⠛⠉⠉⠉⠙⠁⠄⠄⠄⠈⠻⠟⠋⠉⠁⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠙⠛⠛⠁⠄⠄⠄⠄⠄⠹⠿⣿⣿⠶⠄⠄⠄⠄⠄⢀⣤⣾⣿⠁⠄⠄⠄⠄⠄
⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⠛⠋⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⠛⠛⠋⠄⠄⠄⠄⠄⠄`
  )
})
</script>

<template>
  <main id="main">
    <section class="topic_container">
      <div class="info_container">
        <h1 class="title card_styl">
          <span class="underline">
            Paper archiving
          </span>
        </h1>
      </div>
      <div class="img_container">
        <img class="card_styl" src="https://cdn.krahsu.top/pic/ppt202304200331994.jpg" alt="">
      </div>
    </section>
    <section class="main_container">
      <section class="paper_statu card_styl">
        <PaperStatus></PaperStatus>
      </section>
    </section>
  </main>
</template>

<style scoped>
.paper_statu {
  height: 600px;
}

#main {
  margin: auto;
  max-width: 71.25rem;
  margin: 80px auto;
  width: 100%;
}

.topic_container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

.info_container {
  z-index: 1;
  grid-column-start: span 2;
  margin-top: 50px;
}

.img_container {
  grid-column-start: span 10;
}

.title {
  width: fit-content;
  font-size: 4.25rem;
  padding: 2.5rem 2.5rem 3rem 2.5rem;
  background: #fff;
  text-decoration: underline;
  color: #e83f43;
}

.underline {
  color: #000;
}

img {
  width: 100%;
}

[theme='dark'] img {
  filter: brightness(30%);
}

[theme='dark'] .title {
  background-color: #6b6b6b;
  color: #ab2b2d;
}

[theme='dark'] .underline {
  color: white;
}
</style>