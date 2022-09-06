import { ChangeDetectionStrategy, Component, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, filter, map, Observable, tap } from 'rxjs';
import { getConfig } from 'src/app/services/config.provider';
import { LogLevel } from '../../log-level.interface';



const maxLevel = (levels: LogLevel[]) => Math.max(...levels.map(({ key }) => key));



@Component({
  selector: 'app-log-level',
  templateUrl: './log-level.component.html',
  styleUrls: ['./log-level.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogLevelComponent {

  levelControl = new FormControl(0);

  logLevels$: Observable<LogLevel[]> = getConfig('system', 'logLevels').pipe(
    map(levels => levels.map(([key, value]) => ({ key, value }))),
    map(levels => levels.sort((a, b) => a.key - b.key)),
    tap(level => this.levelControl.setValue(maxLevel(level))),
  );

  @Output() levelChange: Observable<number> = this.levelControl.valueChanges.pipe(
    filter(level => level >= 0),
    distinctUntilChanged(),
  );



}
