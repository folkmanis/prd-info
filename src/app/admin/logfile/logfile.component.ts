import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, Signal, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { isEqual } from 'lodash-es';
import { LogCalendarComponent } from './log-filter/log-calendar/log-calendar.component';
import { LogLevelComponent } from './log-filter/log-level/log-level.component';
import { LogfileTableComponent } from './logfile-table/logfile-table.component';
import { validDate } from './services/log-dates-utils';
import { LOG_LEVELS } from './services/log-levels';
import { createLogQueryFilter, LogQueryFilter } from './services/logfile-record';
import { LogfileService } from './services/logfile.service';

@Component({
  selector: 'app-logfile',
  templateUrl: './logfile.component.html',
  styleUrls: ['./logfile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LogfileTableComponent,
    MatButtonModule,
    MatIconModule,
    LogLevelComponent,
    LogCalendarComponent,
    MatCardModule,
  ],
})
export class LogfileComponent {
  #service = inject(LogfileService);

  protected logLevel = signal(LOG_LEVELS.slice(-1)[0][0]);

  protected logDate = signal(new Date());

  protected logFilter: Signal<LogQueryFilter> = computed(
    () => {
      return createLogQueryFilter(this.logLevel(), this.logDate());
    },
    { equal: isEqual },
  );

  protected log = this.#service.getLogfileResource(this.logFilter);

  protected availableDates = this.#service.getDatesGroupResource(this.logLevel);

  constructor() {
    effect(() => {
      const availableDates = this.availableDates.value();
      const logDate = untracked(this.logDate);
      this.logDate.set(validDate(logDate, availableDates));
    });

    effect(() => {
      this.logLevel();
      this.availableDates.reload();
    });
  }

  protected onReload() {
    this.log.reload();
  }
}
