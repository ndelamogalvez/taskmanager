import { Component, Input } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActivityLog } from '../../core/models/board.model';

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, MatIconModule],
  template: `
    <div class="activity-panel">
      <div class="activity-item" *ngFor="let log of logs">
        <mat-icon style="font-size:16px;width:16px;height:16px;color:#626f86">schedule</mat-icon>
        <div>
          <strong>{{ log.userName }}</strong> {{ log.details }}
          <div class="time">{{ log.createdAt | date:'MMM d, HH:mm' }}</div>
        </div>
      </div>
      <div class="empty-state" *ngIf="logs.length === 0">
        <p class="text-muted">No activity yet</p>
      </div>
    </div>
  `
})
export class ActivityLogComponent {
  @Input() logs: ActivityLog[] = [];
}
