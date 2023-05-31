<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" fill="none">
    <path d="M40 28L24 40L8 28" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M8 18H40" stroke-width="4" stroke-linecap="round" />
  </svg>
</template>

<style scoped>
svg path{
  stroke: var(--font-headline);
}
svg{
  cursor: pointer;
  transition: .3s;
}
svg:focus{
  outline: none;
}
svg[aria-expanded='true']{
  transform: rotateZ(180deg);
}
</style>