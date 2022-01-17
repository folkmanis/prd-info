import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { UserSession } from 'src/app/interfaces';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
