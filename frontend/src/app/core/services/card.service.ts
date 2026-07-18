import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Card, CardRequest, MoveCardRequest } from '../models/card.model';

@Injectable({ providedIn: 'root' })
export class CardService {
  private apiUrl = 'http://localhost:8085/api';

  constructor(private http: HttpClient) {}

  create(listId: number, req: CardRequest): Observable<Card> {
    return this.http.post<Card>(`${this.apiUrl}/lists/${listId}/cards`, req);
  }

  update(id: number, req: CardRequest): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/cards/${id}`, req);
  }

  move(id: number, req: MoveCardRequest): Observable<Card> {
    return this.http.patch<Card>(`${this.apiUrl}/cards/${id}/move`, req);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cards/${id}`);
  }
}
