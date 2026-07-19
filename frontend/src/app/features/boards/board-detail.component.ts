import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { BoardService } from '../../core/services/board.service';
import { ListService } from '../../core/services/list.service';
import { CardService } from '../../core/services/card.service';
import { Board } from '../../core/models/board.model';
import { TaskList } from '../../core/models/list.model';
import { Card } from '../../core/models/card.model';
import { CardDialogComponent } from '../cards/card-dialog.component';
import { ActivityLogComponent } from '../../shared/components/activity-log.component';

@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [
    NgFor, NgIf, DatePipe, DragDropModule, MatButtonModule, MatIconModule,
    MatInputModule, MatFormFieldModule, MatMenuModule, FormsModule,
    ActivityLogComponent
  ],
  template: `
    <div class="board-container" *ngIf="board" cdkDropListGroup>
      <div class="lists-scroll" cdkDropList cdkDropListOrientation="horizontal"
           [cdkDropListData]="board.lists"
           [cdkDropListEnterPredicate]="listEnterPredicate"
           (cdkDropListDropped)="onListDrop($event)">
        <div *ngFor="let list of board.lists" cdkDrag>
          <div class="list-card">
            <div class="list-header">
              <h3>{{ list.title }}</h3>
              <button mat-icon-button [matMenuTriggerFor]="menu" style="width:28px;height:28px;line-height:28px">
                <mat-icon style="font-size:16px">more_horiz</mat-icon>
              </button>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="editList(list)"><mat-icon>edit</mat-icon> Rename</button>
                <button mat-menu-item (click)="deleteList(list.id)" style="color:#d32f2f">
                  <mat-icon style="color:#d32f2f">delete</mat-icon> Delete
                </button>
              </mat-menu>
            </div>

            <div class="cards-container" cdkDropList cdkDropListOrientation="vertical"
                 [cdkDropListData]="list.cards"
                 (cdkDropListDropped)="onCardDrop($event, list)"
                 [id]="'list-' + list.id">
              <div class="card-item" *ngFor="let card of list.cards" cdkDrag
                   (click)="openCard(card)">
                <div class="labels-row" *ngIf="card.labels?.length">
                  <span class="label-dot" *ngFor="let lbl of card.labels" [style.background]="lbl.color">
                    {{ lbl.name }}
                  </span>
                </div>
                <div class="card-title">{{ card.title }}</div>
                <div class="card-meta">
                  <span class="due-date" *ngIf="card.dueDate">
                    <mat-icon style="font-size:14px;width:14px;height:14px">calendar_today</mat-icon>
                    {{ card.dueDate | date:'MMM d' }}
                  </span>
                  <span *ngIf="card.assignee" style="display:flex;align-items:center;gap:4px">
                    <mat-icon style="font-size:14px;width:14px;height:14px">person</mat-icon>
                    {{ card.assignee.name }}
                  </span>
                </div>
              </div>
            </div>

            <button mat-button style="width:100%;justify-content:flex-start;margin-top:4px;font-size:13px;color:#626f86"
                    (click)="addCard(list)">
              <mat-icon style="font-size:18px;width:18px;height:18px">add</mat-icon> Add card
            </button>
          </div>
        </div>

        <div class="list-card" style="background:transparent;box-shadow:none;min-width:200px">
          <div *ngIf="!showNewList">
            <button mat-stroked-button style="width:100%;background:rgba(0,0,0,0.05);border:none;padding:12px;border-radius:12px;color:#172b4d"
                    (click)="showNewList = true">
              <mat-icon style="font-size:18px;width:18px;height:18px">add</mat-icon> Add list
            </button>
          </div>
          <div *ngIf="showNewList" class="list-card" style="padding:8px">
            <mat-form-field appearance="outline" style="width:100%;margin-bottom:8px">
              <input matInput [(ngModel)]="newListTitle" placeholder="List title" (keydown.enter)="createList()">
            </mat-form-field>
            <div style="display:flex;gap:8px">
              <button mat-flat-button color="primary" (click)="createList()" [disabled]="!newListTitle">Add</button>
              <button mat-stroked-button (click)="showNewList = false; newListTitle = ''">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="position:fixed;bottom:16px;right:16px;z-index:100" *ngIf="board">
      <button mat-fab color="primary" (click)="showActivity = !showActivity" matTooltip="Activity log">
        <mat-icon>history</mat-icon>
      </button>
    </div>

    <div *ngIf="showActivity && board" style="position:fixed;bottom:80px;right:16px;width:360px;background:white;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.15);padding:16px;z-index:100">
      <h3 style="margin-bottom:12px;font-size:16px">Activity</h3>
      <app-activity-log [logs]="board.activityLogs || []"></app-activity-log>
    </div>
  `
})
export class BoardDetailComponent implements OnInit {
  board: Board | null = null;
  showNewList = false;
  newListTitle = '';
  showActivity = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private listService: ListService,
    private cardService: CardService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadBoard();
  }

  loadBoard() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.boardService.getById(id).subscribe(b => this.board = b);
  }

  createList() {
    if (!this.newListTitle || !this.board) return;
    this.listService.create(this.board.id, { title: this.newListTitle }).subscribe(() => {
      this.newListTitle = '';
      this.showNewList = false;
      this.loadBoard();
    });
  }

  editList(list: TaskList) {
    const title = prompt('List title:', list.title);
    if (title && title !== list.title) {
      this.listService.update(list.id, { title }).subscribe(() => this.loadBoard());
    }
  }

  deleteList(id: number) {
    if (confirm('Delete this list and all its cards?')) {
      this.listService.delete(id).subscribe(() => this.loadBoard());
    }
  }

  addCard(list: TaskList) {
    const dialogRef = this.dialog.open(CardDialogComponent, {
      width: '500px',
      data: { boardId: this.board!.id, listId: list.id, members: this.board!.members }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadBoard();
    });
  }

  openCard(card: Card) {
    const dialogRef = this.dialog.open(CardDialogComponent, {
      width: '500px',
      data: {
        card,
        listId: card.listId,
        boardId: this.board!.id,
        members: this.board!.members,
        lists: this.board!.lists
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadBoard();
    });
  }

  listEnterPredicate(drag: CdkDrag, _drop: CdkDropList): boolean {
    return drag.dropContainer.orientation === 'horizontal';
  }

  onListDrop(event: CdkDragDrop<TaskList[]>) {
    moveItemInArray(this.board!.lists, event.previousIndex, event.currentIndex);
    const listIds = this.board!.lists.map(l => l.id);
    this.listService.reorderLists(this.board!.id, listIds).subscribe();
  }

  onCardDrop(event: CdkDragDrop<Card[]>, targetList: TaskList) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedCard = event.previousContainer.data[event.previousIndex];
      const targetListId = targetList.id;
      this.cardService.move(movedCard.id, { targetListId, newPosition: event.currentIndex }).subscribe({
        next: () => this.loadBoard(),
        error: () => this.loadBoard()
      });
    }
  }
}
