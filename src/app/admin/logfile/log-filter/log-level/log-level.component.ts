import { ChangeDetectionStrategy, Component, Inject, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { distinctUntilChanged, filter, map, Observable, OperatorFunction, pipe, pluck, tap } from 'rxjs';
import { SystemPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { LogLevel } from '../../log-level.interface';

const maxLevel = (levels: LogLevel[]) => Math.max(...levels.map(({ key }) => key));

const logLevelsFromPreferences = (): OperatorFunction<SystemPreferences, LogLevel[]> => pipe(
  pluck('system', 'logLevels'),
  map(levels => levels.sort((a, b) => a[0] - b[0])),
  map(levels => levels.map(level => ({ key: level[0], value: level[1] }))),
);


@Component({
  selector: 'app-log-level',
  templateUrl: './log-level.component.html',
  styleUrls: ['./log-level.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogLevelComponent {

  levelControl = new UntypedFormControl(0);

  logLevels$: Observable<LogLevel[]> = this.config$.pipe(
    logLevelsFromPreferences(),
    tap(level => this.levelControl.setValue(maxLevel(level))),
  );

  @Output() levelChange: Observable<number> = this.levelControl.valueChanges.pipe(
    filter(level => level >= 0),
    distinctUntilChanged(),
  );


  constructor(
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
  ) { }

}
