import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Subject } from 'rxjs';
import { UserSession } from 'src/app/interfaces';

@Component({
  selector: 'app-sessions',
  standalone: true,
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
  ]
})
export class SessionsComponent {

  @Input() sessions: UserSession[] = [];

  @Input() currentSession: string = '';

  @Output() deleteSession = new Subject<string[]>();

  constructor(
  ) { }

  onDeleteAll(sessions: UserSession[]) {
    this.deleteSession.next(sessions.map(s => s._id).filter(id => id !== this.currentSession));
  }

  deleteAllDisabled(): boolean {
    return !this.sessions.length || this.sessions.every(s => s._id === this.currentSession);
  }

}
