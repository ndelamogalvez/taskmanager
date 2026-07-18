import { User } from './user.model';

export interface Card {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  position: number;
  listId: number;
  assignee: User | null;
  createdAt: string;
  updatedAt: string;
  labels: Label[];
}

export interface Label {
  id: number;
  name: string;
  color: string;
}

export interface CardRequest {
  title: string;
  description?: string;
  dueDate?: string;
  assigneeId?: number;
  labels?: { name: string; color: string }[];
}

export interface MoveCardRequest {
  targetListId: number;
  newPosition?: number;
}
