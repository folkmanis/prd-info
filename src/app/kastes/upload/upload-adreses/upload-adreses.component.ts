import { ChangeDetectionStrategy, Component, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, startWith, tap } from 'rxjs/operators';
import { AdresesBox } from '../services/adrese-box';
import { ChipsService } from '../services/chips.service';
import { DragData } from '../services/drag-drop.directive';
import { UploadService } from '../services/upload.service';
import { CdkPortal } from '@angular/cdk/portal';

interface ColumnSelection {
  columns: boolean[];
}

@Component({
  selector: 'app-upload-adreses',
  templateUrl: './upload-adreses.component.html',
  styleUrls: ['./upload-adreses.component.scss'],
  providers: [ChipsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadAdresesComponent implements OnInit {

  @ViewChildren(CdkPortal) buttons: QueryList<CdkPortal>;

  @Input('data') set data(data: Array<string | number>[]) {
    this.uploadService.loadData(data || []);
    this.chipsService.resetChips();
  }

  columns$ = this.uploadService.columns$.pipe(
    tap(cols => this.toCheckGroup(cols)),
    shareReplay(1),
  );

  fb: IFormBuilder;
  checkCols: IFormGroup<ColumnSelection>;
  chkColCount$: Observable<number>;
  checkSkaitiPakas = new FormControl(true);
  rowSelection = this.uploadService.rowSelection;

  @Output() adresesBox: Observable<AdresesBox | null> = combineLatest([
    this.chipsService.chips$,
    this.uploadService.adresesCsv$,
    this.rowSelection.changed.pipe(
      map(model => model.source),
      startWith(this.rowSelection)
    ),
    this.checkSkaitiPakas.valueChanges.pipe(startWith(this.checkSkaitiPakas.value)),
  ]).pipe(
    map(([chips, adreses, selection, toPakas]) =>
      chips.available.length || !selection.selected.length ?
        null : new AdresesBox(adreses.filter((_, idx) => selection.isSelected(idx)), new Map(chips.assignement), toPakas)
    ),
    distinctUntilChanged(),
  );

  constructor(
    private uploadService: UploadService,
    private chipsService: ChipsService,
    fb: FormBuilder,
  ) { this.fb = fb; }

  datasource$ = this.uploadService.adresesCsv$;

  chipsAvailable$: Observable<string[]> = this.chipsService.chips$.pipe(
    map(chips => chips.available),
  );

  chipsAssignement$: Observable<[string, string][]> = this.chipsService.chips$.pipe(
    map(chips => chips.assignement),
  );

  isChipAssigned(chips: [string, string][], col: string): string | undefined {
    return chips.find(([column]) => column === col)?.[1];
  }

  ngOnInit() {
    this.checkCols = this.fb.group<ColumnSelection>({
      columns: this.fb.array<boolean>([]),
    });
    this.chkColCount$ = this.checkCols.valueChanges.pipe(
      map(frmVal => frmVal.columns),
      map(cols => cols.reduce((acc, curr) => acc + (+curr), 0)),
    );
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

  columnsWithSelected = (cols: string[]) => (['selected', ...cols]);

  private toCheckGroup(cols: string[]) {
    const checksArr = this.fb.array<boolean>(cols.map(_ => false));
    this.checkCols.setControl('columns', checksArr);
  }

}
