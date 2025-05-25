import type { IId, TId } from '@/api/types.ts';
import {v4 as uuidv4} from 'uuid';

interface ILocalStorageHook<T> {
  getItems: () => T[];
  createItem: (value: T) => void;
  deleteItem: (localId: TId) => void;
  setItem: (item: T, localId: TId) => void;
}

export const useLocalStorage = <T extends IId>(key: string): ILocalStorageHook<T> => {
  const getItems = (): T[] => {
    return JSON.parse(localStorage.getItem(key) ?? '[]');
  }

  const createItem = (item: T) => {
    let list: T[];
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, '[]');
      list = [];
    } else {
      list = JSON.parse(localStorage.getItem(key) ?? '[]');
    }

    list.push({ ...item, localId: uuidv4() });
    localStorage.setItem(key, JSON.stringify(list));
  }

  const deleteItem = (localId: TId) => {
    if (!localStorage.getItem(key)) {
      return;
    }
    const list: T[] = JSON.parse(localStorage.getItem(key) ?? '[]');
    const index = list.findIndex((item) => item.localId === localId);
    if (index > -1) {
      list.splice(index, 1);
    }
    localStorage.setItem(key, JSON.stringify(list));
  }

  const setItem = (item: T, localId: TId) => {
    if (!localStorage.getItem(key)) {
      return;
    }
    const list: T[] = JSON.parse(localStorage.getItem(key) ?? '[]');
    const index = list.findIndex((item) => item.localId === localId);
    if (index > -1) {
      const oldItem = list.splice(index, 1)[0];
      list.push({ ...item, localId: oldItem.localId, _id: oldItem._id ?? item._id });
    }
    localStorage.setItem(key, JSON.stringify(list));
  }

  return {
    getItems,
    createItem,
    deleteItem,
    setItem,
  }
}
