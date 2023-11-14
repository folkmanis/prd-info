import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Observable, combineLatest } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
  tap,
} from 'rxjs/operators';
import { AdresesBoxPreferences, AdresesBoxes } from '../services/adrese-box';
import { ChipsService, ColumnNames } from '../services/chips.service';
import { DragData, DragDropDirective } from '../services/drag-drop.directive';
import { DragableDirective } from '../services/dragable.directive';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-upload-adreses',
  templateUrl: './upload-adreses.component.html',
  styleUrls: ['./upload-adreses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PortalModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    DragableDirective,
    MatTableModule,
    DragDropDirective,
    MatIconModule,
    AsyncPipe,
  ],
})
export class UploadAdresesComponent {
  @ViewChildren(CdkPortal) buttons: QueryList<CdkPortal>;

  @Input('data') set data(data: Array<string | number>[]) {
    this.uploadService.loadData(data || []);
    this.chipsService.resetChips();
  }

  columns$ = this.uploadService.columns$.pipe(
    tap((cols) => this.toCheckGroup(cols)),
    shareReplay(1)
  );

  checkCols = new FormGroup({
    columns: new FormArray<FormControl<boolean>>([]),
  });

  chkColCount$ = this.checkCols.valueChanges.pipe(
    map((frmVal) => frmVal.columns),
    map((cols) => cols.reduce((acc, curr) => acc + +curr, 0))
  );

  settingsControl = new FormGroup({
    toPakas: new FormControl<boolean>(true),
    mergeAddress: new FormControl<boolean>(false),
  });

  rowSelection = this.uploadService.rowSelection;

  @Output() adresesBox: Observable<AdresesBoxes | null> = combineLatest([
    this.chipsService.chips$,
    this.uploadService.adresesCsv$,
    this.rowSelection.changed.pipe(
      map((model) => model.source),
      startWith(this.rowSelection)
    ),
    this.settingsControl.valueChanges.pipe(
      startWith(this.settingsControl.value)
    ) as Observable<AdresesBoxPreferences>,
  ]).pipe(
    map(([chips, adreses, selection, settings]) =>
      chips.available.length || !selection.selected.length
        ? null
        : new AdresesBoxes(
            adreses.filter((_, idx) => selection.isSelected(idx)),
            chips.assignement,
            settings
          )
    ),
    distinctUntilChanged()
  );

  constructor(
    private uploadService: UploadService,
    private chipsService: ChipsService
  ) {}

  datasource$ = this.uploadService.adresesCsv$;

  chipsAvailable$: Observable<ColumnNames[]> = this.chipsService.chips$.pipe(
    map((chips) => chips.available)
  );

  chipsAssignement$: Observable<[string, ColumnNames][]> =
    this.chipsService.chips$.pipe(map((chips) => chips.assignement));

  isChipAssigned(
    chips: [string, ColumnNames][],
    col: string
  ): string | undefined {
    return chips.find(([column]) => column === col)?.[1];
  }

  onDeleteColumns(cols: boolean[]) {
    this.chipsService.resetChips();
    this.uploadService.deleteAdresesCsvColumns(cols);
    this.checkCols.controls.columns.reset();
  }

  onJoinColumns(cols: boolean[]) {
    this.chipsService.resetChips();
    this.uploadService.joinAdresesCsvColumns(cols);
    this.checkCols.controls.columns.reset();
  }

  onAddEmptyColumn() {
    this.uploadService.addEmptyColumn();
  }

  onDrop(data: DragData, col: string) {
    this.chipsService.moveChip(data.text, col);
  }

  onChipRemove(col: string) {
    this.chipsService.removeChip(col);
  }

  columnsWithSelected = (cols: string[]) => ['selected', ...cols];

  private toCheckGroup(cols: string[]) {
    const checksArr = new FormArray<FormControl<boolean>>(
      cols.map((_) => new FormControl(false))
    );
    this.checkCols.setControl('columns', checksArr);
  }
}
