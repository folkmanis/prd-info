import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-module-group',
  templateUrl: './module-group.component.html',
  styleUrls: ['./module-group.component.scss'],
  imports: [MatToolbarModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModuleGroupComponent {
  pristine = input(true, { transform: booleanAttribute });
  valid = input(true, { transform: booleanAttribute });

  save = output<void>();
  resetForm = output<void>();

  saveDisabled = computed(() => !this.valid() || this.pristine());

  onSave() {
    this.save.emit();
  }

  onReset() {
    this.resetForm.emit();
  }
}
