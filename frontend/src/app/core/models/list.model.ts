import { Card } from './card.model';

export interface TaskList {
  id: number;
  title: string;
  position: number;
  createdAt: string;
  cards: Card[];
}

export interface TaskListRequest {
  title: string;
}
