import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board, BoardRequest, BoardSummary } from '../models/board.model';

@Injectable({ providedIn: 'root' })
export class BoardService {
  private apiUrl = 'http://localhost:8085/api/boards';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BoardSummary[]> {
    return this.http.get<BoardSummary[]>(this.apiUrl);
  }

  getById(id: number): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}/${id}`);
  }

  create(req: BoardRequest): Observable<Board> {
    return this.http.post<Board>(this.apiUrl, req);
  }

  update(id: number, req: BoardRequest): Observable<Board> {
    return this.http.put<Board>(`${this.apiUrl}/${id}`, req);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addMember(id: number, email: string): Observable<Board> {
    return this.http.post<Board>(`${this.apiUrl}/${id}/members`, JSON.stringify(email));
  }
}
