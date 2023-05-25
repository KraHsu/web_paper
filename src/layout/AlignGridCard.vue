<script setup lang='ts'>

</script>

<template>
  <main id="AlignCard">
    <section class="AlignCardContainer">
      <slot></slot>
    </section>
  </main>
</template>

<style scoped>
#AlignCard{
  position: absolute;
  top: 90px;
  width: 100%;
  height: calc(100% - 150px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.AlignCardContainer{
  max-width: 81.25rem;
  min-height: 824px;
  width: 100%;
  height: 100%;
  padding: 25px;
  box-sizing: border-box;
  border-radius: 15px;
  background-color: white;
  box-shadow: 6px 6px 10px #0000001a;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(24, 1fr);
  grid-gap: 15px;
  transition: .3s;
}

[theme='dark'] .AlignCardContainer{
  background-color: #2c2c2c;
}
</style>