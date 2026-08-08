import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Card, CardRequest, MoveCardRequest } from '../models/card.model';

@Injectable({ providedIn: 'root' })
export class CardService {
  private apiUrl = environment.apiUrl;

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

  reorderCards(listId: number, cardIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/lists/${listId}/cards/reorder`, { cardIds });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cards/${id}`);
  }
}
