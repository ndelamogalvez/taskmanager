import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BoardService } from '../../core/services/board.service';
import { BoardSummary } from '../../core/models/board.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [NgFor, NgIf, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule],
  template: `
    <div style="padding: 24px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h1 style="font-size:24px;font-weight:700">My Boards</h1>
        <button mat-flat-button color="primary" (click)="showNewBoard = !showNewBoard">
          <mat-icon>add</mat-icon> New Board
        </button>
      </div>

      <div *ngIf="showNewBoard" style="margin-bottom:24px;padding:16px;background:white;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
        <h3 style="margin-bottom:12px">Create Board</h3>
        <mat-form-field appearance="outline" style="width:100%;margin-bottom:12px">
          <mat-label>Board title</mat-label>
          <input matInput [(ngModel)]="newBoardTitle" placeholder="e.g. Sprint 24">
        </mat-form-field>
        <div style="display:flex;gap:8px">
          <button mat-flat-button color="primary" (click)="createBoard()" [disabled]="!newBoardTitle">Create</button>
          <button mat-stroked-button (click)="showNewBoard = false">Cancel</button>
        </div>
      </div>

      <div class="boards-grid" *ngIf="boards.length > 0; else empty">
        <div class="board-card" *ngFor="let b of boards" (click)="router.navigate(['/boards', b.id])">
          <h3>{{ b.title }}</h3>
          <p *ngIf="b.description">{{ b.description }}</p>
          <div class="board-stats">
            <span><mat-icon style="font-size:14px;width:14px;height:14px;vertical-align:middle">list</mat-icon> {{ b.listCount }} lists</span>
            <span><mat-icon style="font-size:14px;width:14px;height:14px;vertical-align:middle">check_circle</mat-icon> {{ b.cardCount }} cards</span>
          </div>
        </div>
      </div>
      <ng-template #empty>
        <div class="empty-state">
          <mat-icon>dashboard</mat-icon>
          <h3>No boards yet</h3>
          <p>Create your first board to get started</p>
        </div>
      </ng-template>
    </div>
  `
})
export class BoardListComponent implements OnInit {
  boards: BoardSummary[] = [];
  showNewBoard = false;
  newBoardTitle = '';

  constructor(public boardService: BoardService, public router: Router, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadBoards();
  }

  loadBoards() {
    this.boardService.getAll().subscribe(b => this.boards = b);
  }

  createBoard() {
    if (!this.newBoardTitle) return;
    this.boardService.create({ title: this.newBoardTitle }).subscribe(() => {
      this.newBoardTitle = '';
      this.showNewBoard = false;
      this.loadBoards();
    });
  }
}
