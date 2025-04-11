import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, Output, computed, effect, model, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { map } from 'rxjs';
import { ScrollTopDirective } from 'src/app/library/scroll-to-top/scroll-top.directive';
import { ColumnNames, TABLE_COLUMNS } from '../../services/column-names';
import { rawArrayToAddressWithPackage } from '../../services/item-packing.utilities';
import { DragDropDirective } from './drag-drop.directive';
import { DragableDirective } from './dragable.directive';

@Component({
  selector: 'app-upload-adreses',
  templateUrl: './upload-adreses.component.html',
  styleUrls: ['./upload-adreses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatCheckboxModule, MatChipsModule, DragableDirective, MatTableModule, DragDropDirective, MatIconModule, ScrollTopDirective],
})
export class UploadAdresesComponent {
  rowSelection = new SelectionModel<number>(true);
  columnSelection = new SelectionModel<number>(true);

  selectedRows = toSignal(this.rowSelection.changed.pipe(map((change) => change.source)), { initialValue: this.rowSelection });

  adreses = model<Array<number | string>[]>([], { alias: 'data' });

  assignedChips = signal<[number, ColumnNames][]>([]);

  availableChips = computed(() => {
    const assignedNames = this.assignedChips().map(([, name]) => name);
    return TABLE_COLUMNS.filter((name) => assignedNames.includes(name) === false);
  });

  columns = computed(() => {
    const hasData = this.adreses()[0]?.length > 0;
    return hasData ? this.adreses()[0].map((_, idx) => idx) : [];
  });

  displayColumns = computed(() => {
    if (this.columns().length > 0) {
      return ['selected', ...this.columns().map((column) => column.toString())];
    } else {
      return [];
    }
  });
  displayCheckboxColumns = computed(() => this.displayColumns().map((column) => 'checkBox-' + column));

  constructor() {
    effect(() => {
      this.columnSelection.clear();
      this.selectAllRows();
      this.resetChips();
    });
  }

  assignedChipName = (column: number) => this.assignedChips().find(([idx]) => idx === column)?.[1];

  adresesPackages = computed(() => {
    const selectedRows = this.selectedRows();
    if (this.assignedChips().length < TABLE_COLUMNS.length || this.selectedRows().isEmpty()) {
      return null;
    }
    const rows = this.adreses().filter((_, idx) => selectedRows.isSelected(idx));
    return rawArrayToAddressWithPackage(rows, this.assignedChips());
  });

  @Output() adresesBox = toObservable(this.adresesPackages);

  deleteColumns() {
    this.resetChips();

    const updated = this.adreses().map((row) => row.filter((_, column) => !this.columnSelection.isSelected(column)));
    this.adreses.set(updated);

    this.columnSelection.clear();
  }

  joinColumns() {
    this.resetChips();

    this.columnSelection.sort();
    const selected = this.columnSelection.selected;
    const updated = [] as (string | number)[][];

    this.adreses().forEach((row) => {
      const joinedCell = selected.map((idx) => row[idx]).join(' ');
      const joinedIdx = selected[0];

      const updatedRow = row.filter((_, idx) => !this.columnSelection.isSelected(idx) || idx === joinedIdx);
      updatedRow[joinedIdx] = joinedCell;

      updated.push(updatedRow);
    });
    this.adreses.set(updated);

    this.columnSelection.clear();
  }

  addEmptyColumn() {
    this.adreses.set(this.adreses().map((row) => [...row, 0]));
  }

  onDrop(chipName: ColumnNames, targetColumn: number) {
    const update = removeChipByName(this.assignedChips(), chipName);
    this.assignedChips.set([...removeChipByColumn(update, targetColumn), [targetColumn, chipName]]);
  }

  onChipRemove(column: number) {
    const chips = this.assignedChips();
    this.assignedChips.set(removeChipByColumn(chips, column));
  }

  private selectAllRows() {
    this.rowSelection.setSelection(...this.adreses().map((_, idx) => idx));
  }

  private resetChips() {
    this.assignedChips.set([]);
  }
}

function removeChipByName(chips: [number, ColumnNames][], chipName: ColumnNames) {
  return chips.filter(([_, name]) => name !== chipName);
}

function removeChipByColumn(chips: [number, ColumnNames][], column: number) {
  return chips.filter(([idx]) => idx !== column);
}
