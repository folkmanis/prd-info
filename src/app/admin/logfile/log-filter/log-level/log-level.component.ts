import { ChangeDetectionStrategy, Component, computed, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { configuration } from 'src/app/services/config.provider';

@Component({
  selector: 'app-log-level',
  templateUrl: './log-level.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule, MatOptionModule],
})
export class LogLevelComponent {
  #logLevels = configuration('system', 'logLevels');

  protected levelsSorted = computed(() => {
    return [...this.#logLevels()].sort((a, b) => a[0] - b[0]);
  });

  level = model.required<number | null>();
}
