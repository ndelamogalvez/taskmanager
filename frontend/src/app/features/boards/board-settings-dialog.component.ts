import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { BoardService } from '../../core/services/board.service';
import { Board, Member } from '../../core/models/board.model';
import { AuthService } from '../../core/services/auth.service';

export interface BoardSettingsData {
  board: Board;
}

@Component({
  selector: 'app-board-settings-dialog',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Configuración del tablero</h2>
    <mat-dialog-content>
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:8px">
        <mat-form-field appearance="outline">
          <mat-label>Título</mat-label>
          <input matInput [(ngModel)]="title" required>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Descripción</mat-label>
          <textarea matInput [(ngModel)]="description" rows="2"></textarea>
        </mat-form-field>

        <div *ngIf="isOwner">
          <label style="font-size:13px;font-weight:500;color:#626f86;display:block;margin-bottom:8px">Miembros</label>
          <div *ngFor="let m of members" style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:14px">
            <mat-icon style="font-size:18px;width:18px;height:18px">person</mat-icon>
            <span>{{ m.name }}</span>
            <span class="text-muted">({{ m.email }})</span>
            <span class="text-muted" *ngIf="m.role === 'OWNER'">· Propietario</span>
          </div>

          <div style="display:flex;gap:8px;margin-top:8px">
            <mat-form-field appearance="outline" style="flex:1">
              <mat-label>Invitar por email</mat-label>
              <input matInput type="email" [(ngModel)]="inviteEmail" (keydown.enter)="inviteMember()">
            </mat-form-field>
            <button mat-flat-button color="primary" (click)="inviteMember()" [disabled]="!inviteEmail || inviting">
              Invitar
            </button>
          </div>
          <p class="text-muted" *ngIf="inviteError">{{ inviteError }}</p>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button *ngIf="isOwner" (click)="deleteBoard()" style="color:#d32f2f;margin-right:auto">Eliminar tablero</button>
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="!title || saving">Guardar</button>
    </mat-dialog-actions>
  `
})
export class BoardSettingsDialogComponent implements OnInit {
  title = '';
  description = '';
  members: Member[] = [];
  inviteEmail = '';
  inviteError = '';
  inviting = false;
  saving = false;
  isOwner = false;

  constructor(
    private dialogRef: MatDialogRef<BoardSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BoardSettingsData,
    private boardService: BoardService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.title = this.data.board.title;
    this.description = this.data.board.description || '';
    this.members = this.data.board.members || [];
    this.isOwner = this.data.board.ownerId === this.authService.currentUser()?.id;
  }

  save() {
    if (!this.title) return;
    this.saving = true;
    this.boardService.update(this.data.board.id, { title: this.title, description: this.description }).subscribe({
      next: (board) => this.dialogRef.close({ action: 'updated', board }),
      error: () => { this.saving = false; }
    });
  }

  inviteMember() {
    if (!this.inviteEmail) return;
    this.inviting = true;
    this.inviteError = '';
    this.boardService.addMember(this.data.board.id, this.inviteEmail).subscribe({
      next: (board) => {
        this.members = board.members;
        this.inviteEmail = '';
        this.inviting = false;
      },
      error: (err) => {
        this.inviteError = err.error?.error || 'No se pudo invitar al usuario';
        this.inviting = false;
      }
    });
  }

  deleteBoard() {
    this.dialogRef.close({ action: 'delete' });
  }
}
