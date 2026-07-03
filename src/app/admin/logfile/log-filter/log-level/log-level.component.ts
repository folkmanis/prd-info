import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { LOG_LEVELS } from '../../services/log-levels';

@Component({
  selector: 'app-log-level',
  templateUrl: './log-level.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule],
})
export class LogLevelComponent {
  protected levelsSorted = LOG_LEVELS;

  level = model.required<number>();
}
