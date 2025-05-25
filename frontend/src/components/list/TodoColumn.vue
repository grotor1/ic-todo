<template>
  <UnitCard class="todo-column__card" :class="getCardClasses">
    <template v-slot:header>
      <div class="todo-column__header" :class="getHeaderClasses" @click="open = !open">
          Статус: {{ translateStatus(props.status) }}
      </div>
    </template>

    <template v-slot:body>
      <div class="todo-column__wrapper" :class="getWrapperClasses">
        <div class="todo-column">
          <TodoCard v-for="item in getTodos" :key="item._id" :todo="item" />
        </div>
      </div>
    </template>
  </UnitCard>
</template>

<script lang="ts">
export default {};
</script>

<script setup lang="ts">
import type { ETodoStatus } from '@/api/types.ts';
import { computed, ref } from 'vue';
import { todoStore } from '@/api/todoStore.ts';
import UnitCard from '@/components/unit/UnitCard.vue';
import { translateStatus } from '@/api/translators.ts';
import TodoCard from '@/components/list/TodoCard.vue';
import { priorityOrder } from '@/api/order.ts';

interface IProps {
  status: ETodoStatus;
}

const props = defineProps<IProps>();

const open = ref<boolean>(true);

const getTodos = computed(() => {
  return todoStore.getItems.value.filter((item) => {
    return props.status === item.status;
  }).sort((a, b) => {
    const aPriority = priorityOrder.indexOf(a.priority);
    const bPriority = priorityOrder.indexOf(b.priority);
    return aPriority > bPriority ? -1 : 1;
  });
});

const getWrapperClasses = computed(() => [
  open.value && 'todo-column__wrapper_open',
])

const getHeaderClasses = computed(() => [
  open.value && 'todo-column__header_open',
])

const getCardClasses = computed(() => [
  !open.value && 'todo-column__card_closed',
])
</script>

<style lang="scss">
.todo-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;

  &__header {
    position: relative;
    font-weight: inherit;
    &:before {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%) rotate(90deg);
      right: 0;
      width: 24px;
      height: 24px;
      background: url('/arrow.svg');
      transition: transform 0.25s ease;
      transform-origin: center;
    }
    &_open {
      &:before {
        transform: translateY(-50%) rotate(270deg);
      }
    }
  }

  &__card {
    &_closed {
      height: max-content;
    }
  }

  &__wrapper {
    display: grid;
    grid-template-rows: 0fr;
    transition: 0.25s grid-template-rows ease;

    &_open {
      grid-template-rows: 1fr;
    }
  }
}
</style>
