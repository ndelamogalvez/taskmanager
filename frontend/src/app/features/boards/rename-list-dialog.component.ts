import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface RenameListDialogData {
  title: string;
}

@Component({
  selector: 'app-rename-list-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  template: `
    <h2 mat-dialog-title>Renombrar lista</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" style="width:100%;margin-top:8px">
        <mat-label>Título de la lista</mat-label>
        <input matInput [(ngModel)]="title" (keydown.enter)="save()" autofocus>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" [mat-dialog-close]="title" [disabled]="!title">Guardar</button>
    </mat-dialog-actions>
  `
})
export class RenameListDialogComponent {
  title: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: RenameListDialogData) {
    this.title = data.title;
  }

  save() {}
}
