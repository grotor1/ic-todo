<template>
  <div class="card">
    <span v-if="$slots.header" class="card__header">
      <slot name="header"/>
    </span>

    <div class="card__body">
      <slot name="body"/>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
.card {
  border-radius: 4px;
  border: 1px solid #808080;
  padding: 12px;

  display: flex;
  flex-direction: column;
  gap: 12px;

  width: 100%;

  &__header {
    font-size: 24px;
    font-weight: 700;
  }
}
</style>
