import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Card, CardRequest } from '../../core/models/card.model';
import { Member } from '../../core/models/board.model';
import { TaskList } from '../../core/models/list.model';
import { CardService } from '../../core/services/card.service';

const LABEL_COLORS = ['#0079bf', '#d29034', '#519839', '#b04632', '#89609e', '#cd5a91', '#4bbf6b', '#00a2bf'];

@Component({
  selector: 'app-card-dialog',
  standalone: true,
  imports: [
    FormsModule, NgFor, NgIf, MatDialogModule, MatButtonModule, MatInputModule,
    MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>{{ card ? 'Edit' : 'New' }} Card</h2>
    <mat-dialog-content>
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:8px">
        <mat-form-field appearance="outline">
          <mat-label>Title</mat-label>
          <input matInput [(ngModel)]="title" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Due date</mat-label>
          <input matInput [matDatepicker]="picker" [(ngModel)]="dueDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" *ngIf="data.members">
          <mat-label>Assignee</mat-label>
          <mat-select [(ngModel)]="assigneeId">
            <mat-option [value]="null">None</mat-option>
            <mat-option *ngFor="let m of data.members" [value]="m.userId">{{ m.name }}</mat-option>
          </mat-select>
        </mat-form-field>

        <div>
          <label style="font-size:13px;font-weight:500;color:#626f86;margin-bottom:6px;display:block">Labels</label>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px">
            <span *ngFor="let lbl of labels; let i = index"
                  style="padding:4px 10px;border-radius:12px;font-size:12px;color:white;cursor:pointer;display:flex;align-items:center;gap:4px"
                  [style.background]="lbl.color">
              {{ lbl.name }}
              <mat-icon style="font-size:14px;width:14px;height:14px;cursor:pointer" (click)="removeLabel(i)">close</mat-icon>
            </span>
          </div>
          <div style="display:flex;gap:4px;flex-wrap:wrap">
            <span *ngFor="let color of availableColors"
                  style="width:24px;height:24px;border-radius:50%;cursor:pointer;border:2px solid transparent"
                  [style.background]="color"
                  [style.border-color]="color === selectedLabelColor ? '#333' : 'transparent'"
                  (click)="selectedLabelColor = color"></span>
          </div>
          <div style="display:flex;gap:6px;margin-top:6px" *ngIf="selectedLabelColor">
            <mat-form-field appearance="outline" style="flex:1">
              <input matInput [(ngModel)]="newLabelName" placeholder="Label name" (keydown.enter)="addLabel()">
            </mat-form-field>
            <button mat-icon-button color="primary" (click)="addLabel()"><mat-icon>add</mat-icon></button>
          </div>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button *ngIf="card" (click)="deleteCard()" style="color:#d32f2f;margin-right:auto">Delete</button>
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="!title">Save</button>
    </mat-dialog-actions>
  `
})
export class CardDialogComponent implements OnInit {
  card: Card | null = null;
  title = '';
  description = '';
  dueDate: Date | null = null;
  assigneeId: number | null = null;
  labels: { name: string; color: string }[] = [];
  newLabelName = '';
  selectedLabelColor = '';
  availableColors = LABEL_COLORS;

  constructor(
    private dialogRef: MatDialogRef<CardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { card?: Card; listId: number; boardId: number; members: Member[]; lists?: TaskList[] },
    private cardService: CardService
  ) {}

  ngOnInit() {
    this.card = this.data.card || null;
    if (this.card) {
      this.title = this.card.title;
      this.description = this.card.description || '';
      this.dueDate = this.card.dueDate ? new Date(this.card.dueDate) : null;
      this.assigneeId = this.card.assignee?.id || null;
      this.labels = (this.card.labels || []).map(l => ({ name: l.name, color: l.color }));
    }
  }

  addLabel() {
    if (this.newLabelName && this.selectedLabelColor) {
      this.labels.push({ name: this.newLabelName, color: this.selectedLabelColor });
      this.newLabelName = '';
      this.selectedLabelColor = '';
    }
  }

  removeLabel(index: number) {
    this.labels.splice(index, 1);
  }

  save() {
    if (!this.title) return;
    const req: CardRequest = {
      title: this.title,
      description: this.description || undefined,
      dueDate: this.dueDate?.toISOString().split('T')[0] || undefined,
      assigneeId: this.assigneeId || undefined,
      labels: this.labels.length > 0 ? this.labels : undefined
    };

    const obs = this.card
      ? this.cardService.update(this.card.id, req)
      : this.cardService.create(this.data.listId, req);

    obs.subscribe(() => this.dialogRef.close(true));
  }

  deleteCard() {
    if (this.card && confirm('Delete this card?')) {
      this.cardService.delete(this.card.id).subscribe(() => this.dialogRef.close(true));
    }
  }
}
