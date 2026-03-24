import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { disabled, form, FormField, FormValueControl } from '@angular/forms/signals';
import { JobsSettings } from 'src/app/interfaces';
import { SimpleListTableComponent } from 'src/app/library/simple-list-table/simple-list-table.component';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { UnitsDialogComponent } from './units-dialog/units-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-jobs-preferences',
  templateUrl: './jobs-preferences.component.html',
  styleUrls: ['./jobs-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SimpleListTableComponent, FormField, MatFormFieldModule, MatInput, MatDivider],
})
export class JobsPreferencesComponent implements FormValueControl<JobsSettings> {
  value = model<JobsSettings>({ productCategories: [], jobStates: [], productUnits: [], jobRootPath: '' });

  disabled = input(false);

  protected settingsForm = form(this.value, (s) => {
    disabled(s, () => this.disabled());
  });

  categoryDialog = CategoryDialogComponent;
  unitsDialog = UnitsDialogComponent;
}
