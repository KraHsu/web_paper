<script setup lang='ts'>
import AlignCard from '@/layout/AlignGridCard.vue';
import UserMenu from '@/components/user/UserMenu.vue';
// import { ref, reactive, computed } from 'vue'

</script>

<template>
  <AlignCard>
    <!-- <section class="logout" @click="logout">logout</section> -->
    <!-- <header class="user_info user_card">
        <Userinfo></Userinfo>
    </header> -->
    <aside class="user_aside user_card">
      <UserMenu></UserMenu>
    </aside>
    <Suspense>
      <main class="user_main user_card">
        <RouterView></RouterView>
      </main>
    </Suspense>
  </AlignCard>
</template>

<style scoped>
.user_card {
  border: 2px solid var(--border-grey);
  border-radius: 8px;
}

/* .user_info {
  grid-area: 1 / 1 / 8 / 13;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
} */

.user_aside {
  grid-area: 1 / 1 / 25 / 4;
}

.user_main {
  grid-area: 1 / 4 / 25 / 13;
  display: grid;
  justify-items: center;
  align-items: center;
}
</style>