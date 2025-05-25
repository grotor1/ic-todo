export type TId = string;

export interface IId {
  _id: TId;
  localId: TId;
}

export enum ETodoStatus {
  NOT_STARTED = 'not_started',
  WORKING = 'working',
  COMPLETED = 'completed',
}

export enum ETodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface ITodo extends IId {
  name: string;
  description?: string;
  steps: {
    name: string;
    completed: boolean;
  }[];
  priority: ETodoPriority;
  status: ETodoStatus;
  deadline: string;
  createdAt: string;
}
