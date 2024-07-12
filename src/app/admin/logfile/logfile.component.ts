import { ChangeDetectionStrategy, Component, computed, effect, inject, model, signal, untracked } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { HttpCacheService } from 'src/app/library/http/http-cache.service';
import { configuration } from 'src/app/services/config.provider';
import { LogfileApiService } from '../services/logfile-api.service';
import { LogQueryFilter, LogRecord } from '../services/logfile-record';
import { validDate } from './log-dates-utils';
import { LogCalendarComponent } from './log-filter/log-calendar/log-calendar.component';
import { LogLevelComponent } from './log-filter/log-level/log-level.component';
import { LogLevel } from './log-level.interface';
import { LogfileTableComponent } from './logfile-table/logfile-table.component';

function maxLevel(levels: LogLevel[]) {
  if (levels.length > 0) {
    return Math.max(...levels.map(({ key }) => key));
  } else {
    return null;
  }
}

@Component({
  selector: 'app-logfile',
  templateUrl: './logfile.component.html',
  styleUrls: ['./logfile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [LogfileTableComponent, MatButtonModule, MatIconModule, LogLevelComponent, LogCalendarComponent],
})
export class LogfileComponent {
  private api = inject(LogfileApiService);
  private cacheService = inject(HttpCacheService);

  private levelsMap = configuration('system', 'logLevels');

  logLevels = computed(() => {
    const levelObj = this.levelsMap().map(([key, value]) => ({ key, value }));
    levelObj.sort((a, b) => a.key - b.key);
    return levelObj;
  });

  logLevel = model<number | null>(null);

  logDate = model<Date | null>(null);

  logFilter = computed(() => {
    const logLevel = this.logLevel();
    const logDate = this.logDate();
    if (typeof logLevel !== 'number' || !(logDate instanceof Date)) {
      return null;
    }
    return new LogQueryFilter(logLevel, logDate);
  });

  log = signal<LogRecord[]>([]);

  availableDates = signal<Date[]>([]);

  constructor() {
    effect(
      () => {
        const level = maxLevel(this.logLevels());
        this.logLevel.set(level);
      },
      { allowSignalWrites: true },
    );

    effect(
      (onCleanup) => {
        const subscription = this.getLog(this.logFilter());
        onCleanup(() => subscription?.unsubscribe());
      },
      { allowSignalWrites: true },
    );

    effect(
      (onCleanup) => {
        const logLevel = this.logLevel();
        if (typeof logLevel !== 'number') {
          return;
        }
        const subscription = this.api.getDatesGroups(logLevel).subscribe((dates) => this.availableDates.set(dates));

        onCleanup(() => subscription?.unsubscribe());
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        const availableDates = this.availableDates();
        const logDate = untracked(this.logDate);
        this.logDate.set(validDate(logDate, availableDates));
      },
      { allowSignalWrites: true },
    );
  }

  onReload() {
    this.getLog(this.logFilter());
  }

  private getLog(logFilter: LogQueryFilter | null): Subscription | undefined {
    if (logFilter == null) {
      return;
    }

    this.cacheService.clear();
    return this.api.getLog(logFilter).subscribe((log) => this.log.set(log));
  }
}
