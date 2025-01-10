import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { LogLevel } from '../../log-level.interface';

@Component({
  selector: 'app-log-level',
  templateUrl: './log-level.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule],
})
export class LogLevelComponent {
  logLevels = input.required<LogLevel[]>();

  level = model.required<number>();
}
