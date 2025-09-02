import { ChangeDetectionStrategy, Component, computed, effect, inject, model, Signal, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { isEqual } from 'lodash-es';
import { configuration } from 'src/app/services/config.provider';
import { LogCalendarComponent } from './log-filter/log-calendar/log-calendar.component';
import { LogLevelComponent } from './log-filter/log-level/log-level.component';
import { LogfileTableComponent } from './logfile-table/logfile-table.component';
import { validDate } from './services/log-dates-utils';
import { createLogQueryFilter, LogQueryFilter } from './services/logfile-record';
import { LogfileService } from './services/logfile.service';

@Component({
  selector: 'app-logfile',
  templateUrl: './logfile.component.html',
  styleUrls: ['./logfile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogfileTableComponent, MatButtonModule, MatIconModule, LogLevelComponent, LogCalendarComponent, MatCardModule],
})
export class LogfileComponent {
  #service = inject(LogfileService);

  #levelsMap = configuration('system', 'logLevels');

  protected logLevel = model<number | null>(null);

  protected logDate = model<Date>(new Date());

  protected logFilter: Signal<LogQueryFilter | null> = computed(
    () => {
      const logLevel = this.logLevel();
      const logDate = this.logDate();
      if (typeof logLevel !== 'number' || !(logDate instanceof Date)) {
        return null;
      } else {
        return createLogQueryFilter(logLevel, logDate);
      }
    },
    { equal: isEqual },
  );

  protected log = this.#service.getLogfileResource(this.logFilter);

  protected availableDates = this.#service.getDatesGroupResource(this.logLevel);

  constructor() {
    effect(() => {
      const levels = this.#levelsMap();
      if (levels.length > 0) {
        this.logLevel.set(Math.max(...levels.map((level) => level[0])));
      } else {
        this.logLevel.set(null);
      }
    });

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
