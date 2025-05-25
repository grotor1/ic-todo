import type { TId } from '@/api/types.ts';

export const useCrudFetch = <T>(url: string) => {
  return {
    get: async (id: TId): Promise<T | undefined> => {
      try {
        const res = await fetch(`${url}/${id}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const json = await res.json();
        return json;
      } catch (e: unknown) {
        console.log(e);
        return undefined;
      }
    },
    getAll: async (): Promise<T[] | undefined> => {
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const json = await res.json();
        return json;
      } catch (e: unknown) {
        console.log(e);
        return undefined;
      }
    },
    post: async (item: T): Promise<T | undefined> => {
      try {
        const res = await fetch(url, {
          method: "POST",
          body: JSON.stringify(item),
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const json = await res.json();
        return json;
      } catch (e: unknown) {
        console.log(e);
        return undefined;
      }
    },
    put: async (item: T, id: TId): Promise<void> => {
      try {
        const res = await fetch(`${url}/${id}`, {
          method: "PUT",
          body: JSON.stringify(item),
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const json = await res.json();
        return json;
      } catch (e: unknown) {
        console.log(e);
        return undefined;
      }
    },
    remove: async (id: TId): Promise<void> => {
      try {
        const res = await fetch(`${url}/${id}`, {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const json = await res.json();
        return json;
      } catch (e: unknown) {
        console.log(e);
        return undefined;
      }
    },
  }
}
