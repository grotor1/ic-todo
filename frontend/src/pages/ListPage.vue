<template>
  <BasePageWrapper>
    <div class="list-page">
      <CreateCard />

      <div class="list">
        <TodoColumn v-for="(item, key) in statusOrder" :key="key" :status="item" />
      </div>
    </div>
  </BasePageWrapper>
</template>

<script setup lang="ts">
import BasePageWrapper from '@/components/base/BasePageWrapper.vue';
import CreateCard from '@/components/create/CreateCard.vue';
import TodoColumn from '@/components/list/TodoColumn.vue';
import { statusOrder } from '@/api/order.ts';
</script>

<style lang="scss" scoped>
.list-page {
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
}

.list {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
</style>
