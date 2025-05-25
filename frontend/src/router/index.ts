import { createRouter, createWebHistory } from 'vue-router';
import { ERoutesName } from '@/router/enums.ts';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ERoutesName.ListPage,
      component: () => import('@/pages/ListPage.vue'),
    },
  ],
});

export default router;
