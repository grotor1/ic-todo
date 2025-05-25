<template>
  <CardUnit>
    <template v-slot:header> Создайте задачу </template>

    <template v-slot:body>
      <form ref="form">
        <div class="create-card__body">
          <div class="create-card__row">
            <input
              maxlength="100"
              required
              class="create-card__input"
              placeholder="Введите название"
              type="text"
              v-model="name"
            />

            <label>
              Приоритет:

              <select v-model="priority">
                <option v-for="(value, key) in ETodoPriority" :key="key" :value="value">
                  {{ translatePriority(value) }}
                </option>
              </select>
            </label>
          </div>

          <input v-model="deadline" type="datetime-local" placeholder="Выберите дедлайн" />

          <textarea
            maxlength="1000"
            class="create-card__textarea"
            placeholder="Введите описание"
            :rows="5"
            v-model="description"
          />

          <span>Шаги:</span>

          <div v-for="(item, key) in steps" :key class="create-card__row">
            <input
              class="create-card__input"
              type="text"
              v-model="steps[key].name"
              required
              placeholder="Введите название шага"
            />

            <button type="button" @click="() => removeStep(key)">Удалить</button>
          </div>

          <div class="create-card__row">
            <button type="button" @click="addStep">Добавить шаг</button>
          </div>

          <button type="submit">Создать</button>
        </div>
      </form>
    </template>
  </CardUnit>
</template>

<script lang="ts">
export default {};
</script>

<script setup lang="ts">
import CardUnit from '@/components/unit/UnitCard.vue';
import { computed, onMounted, ref } from 'vue';
import { ETodoPriority, type ITodo } from '@/api/types.ts';
import { todoStore } from '@/api/todoStore.ts';
import { translatePriority } from '../../api/translators.ts';

const form = ref<HTMLFormElement>();

const name = ref<string>('');
const description = ref<string>('');
const deadline = ref<string>('');
const priority = ref<ETodoPriority>(ETodoPriority.LOW);
const steps = ref<ITodo['steps']>([]);

const todoForm = computed<ITodo>(() => {
  return {
    name: name.value,
    description: description.value,
    deadline: deadline.value,
    priority: priority.value,
    steps: steps.value,
  } as ITodo;
});

const onSubmit = async (e: SubmitEvent): Promise<void> => {
  e.preventDefault();
  await create();
};

onMounted(() => {
  form.value?.addEventListener('submit', onSubmit);
});

const addStep = () => {
  steps.value.push({
    name: '',
    completed: false,
  });
};

const removeStep = (index: number) => {
  steps.value.splice(index, 1);
};

const cleanup = () => {
  name.value = '';
  description.value = '';
  deadline.value = '';
  priority.value = ETodoPriority.LOW;
  steps.value = [];
}

const create = async () => {
  try {
    await todoStore.createItem(todoForm.value);
    cleanup();
  } catch (error) {}
};
</script>

<style lang="scss">
.create-card {
  &__body {
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__input {
    flex-grow: 1;
  }

  &__textarea {
    width: 100%;
    min-width: 100%;
    max-width: 100%;
  }

  &__row {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 8px;
  }

  &__button {
    width: 300px;
  }
}
</style>
