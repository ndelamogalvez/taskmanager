import { TaskList } from './list.model';
import { User } from './user.model';

export interface Board {
  id: number;
  title: string;
  description: string;
  ownerId: number;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  lists: TaskList[];
  members: Member[];
  activityLogs: ActivityLog[];
}

export interface BoardSummary {
  id: number;
  title: string;
  description: string;
  ownerId: number;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  listCount: number;
  cardCount: number;
}

export interface BoardRequest {
  title: string;
  description?: string;
}

export interface Member {
  id: number;
  userId: number;
  name: string;
  email: string;
  role: string;
}

export interface ActivityLog {
  id: number;
  userId: number;
  userName: string;
  action: string;
  entityType: string;
  entityId: number;
  details: string;
  createdAt: string;
}
