import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { UserSession } from 'src/app/interfaces';

@Component({
  selector: 'app-sessions',
  standalone: true,
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatListModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class SessionsComponent {
  sessions = input([] as UserSession[]);

  currentSession = input<string>();

  deleteSession = output<string[]>();

  deleteAllDisabled = computed(() => this.sessions().length === 0 ||
    this.sessions().every((s) => s._id === this.currentSession())
  );

  onDeleteAll() {
    const currentSession = this.currentSession();
    this.deleteSession.emit(
      this.sessions().map((s) => s._id).filter((id) => id !== currentSession)
    );
  }

}
