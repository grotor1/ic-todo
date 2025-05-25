<template>
  <div class="base-page-wrapper">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.base-page-wrapper {
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  align-items: center;
}
</style>
