<template>
  <UnitCard>
    <template v-slot:body>
      <div class="todo-card">
        <div class="todo-card__row">
          <span> Дедлайн: <input type="datetime-local" v-model="getDeadline" /> </span>

          <label>
            Приоритет:

            <select v-model="editTodo.priority">
              <option v-for="(value, key) in ETodoPriority" :key="key" :value="value">
                {{ translatePriority(value) }}
              </option>
            </select>
          </label>
        </div>

        <input v-model="editTodo.name" maxlength="100" class="todo-card__title" type="text" />

        <textarea
          maxlength="1000"
          class="todo-card__textarea"
          v-model="editTodo.description"
          rows="4"
          placeholder="Описание"
        />

        <span>Шаги:</span>

        <div v-for="(item, key) in editTodo.steps" :key="key" class="todo-card__step">
          <input type="checkbox" v-model="editTodo.steps[key].completed" />

          <input
            class="todo-card__step-input"
            v-model="editTodo.steps[key].name"
            placeholder="Название шага"
          />

          <button @click="() => removeStep(key)">Удалить</button>
        </div>

        <div>
          <button @click="addStep">Добавить шаг</button>
        </div>

        <template v-if="editTodo.steps.length">
          <span>Прогресс: {{(getProgress * 100).toFixed(0)}}%</span>

          <div class="todo-card__progress-bar-wrapper">
            <div class="todo-card__progress-bar"/>
          </div>
        </template>

        <div class="todo-card__row">
          <div class="todo-card__button-wrapper">
            <button
              class="todo-card__button"
              v-if="[ETodoStatus.COMPLETED, ETodoStatus.WORKING].includes(editTodo.status)"
              @click="
                editTodo.status =
                  editTodo.status === ETodoStatus.COMPLETED
                    ? ETodoStatus.WORKING
                    : ETodoStatus.NOT_STARTED
              "
            >
              &lt; {{ editTodo.status === ETodoStatus.COMPLETED ? 'В работу' : 'В бэклог' }}
            </button>
          </div>

          <button @click="todoStore.deleteItem(editTodo._id)">Удалить</button>

          <div class="todo-card__button-wrapper">
            <button
              class="todo-card__button"
              v-if="[ETodoStatus.WORKING, ETodoStatus.NOT_STARTED].includes(editTodo.status)"
              @click="
                editTodo.status =
                  editTodo.status === ETodoStatus.NOT_STARTED
                    ? ETodoStatus.WORKING
                    : ETodoStatus.COMPLETED
              "
            >
              {{ editTodo.status === ETodoStatus.NOT_STARTED ? 'В работу' : 'Завершить' }} &gt;
            </button>
          </div>
        </div>
      </div>
    </template>
  </UnitCard>
</template>

<script setup lang="ts">
import { ETodoPriority, ETodoStatus, type ITodo } from '@/api/types.ts';
import UnitCard from '@/components/unit/UnitCard.vue';
import { computed, ref, watch } from 'vue';
import { watchDebounced } from '@vueuse/core';
import { todoStore } from '@/api/todoStore.ts';
import { translatePriority } from '@/api/translators.ts';

interface IProps {
  todo: ITodo;
}

const props = defineProps<IProps>();

const editTodo = ref<ITodo>(props.todo);

const getDeadline = computed({
  get: () => toISOStringWithTimezone(new Date(editTodo.value.deadline)).slice(0, 16),
  set: (value) => (editTodo.value.deadline = new Date(value).toISOString()),
});

const getProgress = computed(
  () =>
    editTodo.value.steps.filter((value) => value.completed).length / editTodo.value.steps.length,
);

const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, '0');

const getTimezoneOffset = (date: Date) => {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? '+' : '-';
  return diff + pad(tzOffset / 60) + ':' + pad(tzOffset % 60);
};

const toISOStringWithTimezone = (date: Date) => {
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds()) +
    getTimezoneOffset(date)
  );
};

const addStep = () => {
  editTodo.value.steps.push({
    name: '',
    completed: false,
  });
};

const removeStep = (index: number) => {
  editTodo.value.steps.splice(index, 1);
};

watchDebounced(
  editTodo,
  (value, oldValue) => {
    if (value._id === oldValue._id) todoStore.setItem(value, value._id);
  },
  {
    deep: true,
    debounce: 1000,
  },
);

watch(
  () => props.todo,
  (value) => {
    editTodo.value = value;
  },
);
</script>

<style lang="scss">
.todo-card {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__title {
    font-size: 18px;
    font-weight: bold;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__step {
    display: flex;
    gap: 8px;

    &-input {
      flex-grow: 1;
    }
  }

  &__progress-bar {
    position: absolute;
    background: crimson;
    width: calc(100% * v-bind(getProgress));
    height: 100%;
    border-radius: inherit;
    transition: width 0.2s ease-in-out;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      width: 200%;
      height: 100%;
      right: 0;
      background: url("/pattern.svg") repeat;


      @keyframes move {
        from {
          transform: translateX(0);
        }

        to {
          transform: translateX(50%);
        }
      }

      animation: move 10s infinite linear;
    }


    &-wrapper {
      border: 1px solid grey;
      position: relative;
      width: 100%;
      border-radius: 8px;
      height: 16px;
    }
  }

  &__textarea {
    min-width: 100%;
    max-width: 100%;
  }

  &__button-wrapper {
    width: 100px;
  }

  &__button {
    width: 100%;
  }
}
</style>
