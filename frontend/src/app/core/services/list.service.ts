import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TaskList, TaskListRequest } from '../models/list.model';

@Injectable({ providedIn: 'root' })
export class ListService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  create(boardId: number, req: TaskListRequest): Observable<TaskList> {
    return this.http.post<TaskList>(`${this.apiUrl}/boards/${boardId}/lists`, req);
  }

  update(id: number, req: TaskListRequest): Observable<TaskList> {
    return this.http.put<TaskList>(`${this.apiUrl}/lists/${id}`, req);
  }

  reorderLists(boardId: number, listIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/boards/${boardId}/lists/reorder`, { listIds });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/lists/${id}`);
  }
}
