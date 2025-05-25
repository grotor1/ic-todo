import { ETodoPriority, ETodoStatus } from '@/api/types.ts';

export const translatePriority = (value: ETodoPriority) => {
  switch (value) {
    case ETodoPriority.LOW:
      return 'Низкий';
    case ETodoPriority.MEDIUM:
      return 'Средний';
    case ETodoPriority.HIGH:
      return 'Высокий';
  }
}

export const translateStatus = (value: ETodoStatus) => {
  switch (value) {
    case ETodoStatus.NOT_STARTED:
      return 'Не начато';
    case ETodoStatus.WORKING:
      return 'В работе';
    case ETodoStatus.COMPLETED:
      return 'Завершено';
  }
}
