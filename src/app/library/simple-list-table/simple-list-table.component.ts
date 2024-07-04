import { ComponentType } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { tap } from 'rxjs';


@Component({
  selector: 'app-simple-list-table',
  templateUrl: './simple-list-table.component.html',
  styleUrls: ['./simple-list-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SimpleListTableComponent,
      multi: true,
    },
  ],
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatTooltipModule, MatIconModule],
})
export class SimpleListTableComponent<T, K extends keyof T & string> implements ControlValueAccessor {
  private dialog = inject(MatDialog);

  private onChangeFn: (obj: T[]) => void = () => { };
  private onTouchedFn: () => void = () => { };

  columns = input.required<K[]>();
  displayedColumns = computed(() => ['button', ...this.columns()]);

  editDialog = input<ComponentType<any>>();

  disabled = signal(false);

  data = signal([] as T[]);

  writeValue(obj: T[]) {
    this.data.set(obj);
  }

  registerOnChange(fn: (obj: T[]) => void) {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled.set(isDisabled);
  }

  onAddRow() {
    const dialogComponent = this.editDialog();
    if (!dialogComponent) {
      return;
    }
    this.onTouchedFn();
    this.dialog
      .open<any, T, T | undefined>(dialogComponent)
      .afterClosed()
      .subscribe((newRecord) => newRecord && this.updateData(() => this.addRecord(newRecord)));
  }

  onEditRow(obj: T, idx: number) {
    const dialogComponent = this.editDialog();
    if (this.disabled() || !dialogComponent) {
      return;
    }
    this.onTouchedFn();
    this.dialog
      .open<any, T, T | undefined>(dialogComponent, { data: obj })
      .afterClosed()
      .subscribe((update) => update && this.updateData(() => this.updateRecord(idx, update)));
  }

  onRemoveRow(idx: number) {
    this.onTouchedFn();
    this.updateData(() => this.removeRecord(idx));
  }

  private updateData(updateFn: () => void) {
    updateFn();
    this.onChangeFn(this.data());
  }

  private addRecord(record: T) {
    this.data.update(records => [...records, record]);
  }

  private removeRecord(idx: number) {
    this.data.update(records => records.filter((_, i) => i !== idx));
  }

  private updateRecord(idx: number, record: T) {
    this.data.update(records => records.map((d, i) => (i === idx ? record : d)));
  }

}
