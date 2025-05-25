import { useLocalStorage } from '@/api/hooks/useLocalStorage.ts';
import type { IId, TId } from '@/api/types.ts';
import { computed, type ComputedRef, type Ref, ref } from 'vue';
import { useCrudFetch } from '@/api/hooks/useCrudFetch.ts';

interface IGenericStore<T> {
  syncItems: () => Promise<void>;
  createItem: (value: T) => Promise<void>;
  deleteItem: (id: TId) => Promise<void>;
  setItem: (item: T, id: TId) => Promise<void>;
  getItems: ComputedRef<T[]>;
}

export const useGenericStore = <T extends IId>(url: string, key: string): IGenericStore<T> => {
  const localStorageWrapper = useLocalStorage<T>(key);
  const crudFetch = useCrudFetch<T>(url);
  const items = ref<T[]>([]) as Ref<T[]>;

  const syncItems = async () => {
    const localItems: T[] = localStorageWrapper.getItems();
    try {
      const remoteItems = await crudFetch.getAll();
      if (remoteItems) {
        const remoteOnly = remoteItems.filter(
          (remote) => localItems.findIndex((local) => local._id === remote._id) === -1,
        );

        const localOnly = localItems.filter(
          (local) => remoteItems.findIndex((remote) => local._id === remote._id) === -1,
        );

        await Promise.all(
          localOnly.map(async (item) => {
            const newItem = await crudFetch.post({ ...item, localId: undefined });
            if (newItem) {
              localStorageWrapper.setItem(newItem, item.localId as string);
            }
          }),
        );

        remoteOnly.forEach((item) => {
          localStorageWrapper.createItem(item);
        });

        items.value = localStorageWrapper.getItems();
      } else {
        items.value = localItems;
      }
    } catch (e: unknown) {
      console.log(e);
    }
  };

  const getItems = computed(() => items.value);

  const createItem = async (value: T) => {
    let local = value;
    const item = await crudFetch.post(value);
    if (item) {
      if ('error' in item) {
        console.error(item.error);
        delete item.error;
      }
      local = { ...local, ...item };
    }
    items.value.push(local);
    localStorageWrapper.createItem(local);
  };

  const deleteItem = async (id: TId) => {
    const itemToDelete = items.value.find((item) => item._id === id);
    if (itemToDelete) {
      const index = items.value.findIndex((item) => item._id === id)
      localStorageWrapper.deleteItem(itemToDelete.localId);
      items.value.splice(index, 1);
    }
    await crudFetch.remove(id);
  };

  const setItem = async (item: T, id: TId) => {
    const itemToUpdate = items.value.find((item) => item._id === id);
    if (itemToUpdate) {
      const index = items.value.findIndex((item) => item._id === id)
      localStorageWrapper.setItem(item, itemToUpdate.localId);
      items.value[index] = itemToUpdate;
    }
    await crudFetch.put(item, id);
  };

  syncItems();

  return {
    getItems,
    syncItems,
    createItem,
    deleteItem,
    setItem,
  };
};
