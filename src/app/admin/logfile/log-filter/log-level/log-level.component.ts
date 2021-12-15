import { Component, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, Observable } from 'rxjs';
import { LogLevel } from '../../log-level.interface';

@Component({
  selector: 'app-log-level',
  templateUrl: './log-level.component.html',
  styleUrls: ['./log-level.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogLevelComponent {

  levelControl = new FormControl(0);

  private _logLevels: LogLevel[] = [];
  @Input() set logLevels(value: LogLevel[]) {
    if (!value) {
      return;
    }
    this._logLevels = value;
    const maxLevel = Math.max(...value.map(({ key }) => key));
    this.levelControl.setValue(maxLevel);
  }
  get logLevels(): LogLevel[] {
    return this._logLevels;
  }

  @Output() levelChange: Observable<number> = this.levelControl.valueChanges.pipe(
    distinctUntilChanged(),
  );


  constructor() { }

}
