import { Component, computed, inject, linkedSignal, signal, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { isEqual } from 'lodash-es';
import { LogCalendarComponent } from './log-filter/log-calendar/log-calendar.component';
import { LogLevelComponent } from './log-filter/log-level/log-level.component';
import { LogfileTableComponent } from './logfile-table/logfile-table.component';
import { validDate } from './services/log-dates-utils';
import { LOG_LEVELS } from './services/log-levels';
import { LogFilter } from './services/logfile-record';
import { LogfileService } from './services/logfile.service';

const logFilter = (logDate: Date | undefined, logLevel: number): LogFilter | undefined =>
  logDate && {
    level: logLevel,
    dateFrom: logDate,
    dateTo: logDate,
  };

@Component({
  selector: 'app-logfile',
  templateUrl: './logfile.component.html',
  styleUrls: ['./logfile.component.scss'],
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

  protected logDate = linkedSignal<Date[], Date | undefined>({
    source: () => this.availableDates.value(),
    computation: (availableDates, previous) => validDate(previous?.value, availableDates),
  });

  protected logFilter: Signal<LogFilter | undefined> = computed(() => logFilter(this.logDate(), this.logLevel()), {
    equal: isEqual,
  });

  protected availableDates = this.#service.getDatesGroupSnapshot(this.logLevel);
  protected log = this.#service.getLogfileResource(this.logFilter);

  protected onReload() {
    this.log.reload();
  }
}
