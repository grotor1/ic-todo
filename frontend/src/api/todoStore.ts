import { useGenericStore } from '@/api/hooks/useGenericStore.ts';
import type { ITodo } from '@/api/types.ts';
import { BASE_URL } from '@/api/consts.ts';

const key = 'todos'
const url = `${BASE_URL}/${key}`

export const todoStore = useGenericStore<ITodo>(url, key);
