import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { UploadService } from '../services/upload.service';
import { TABLE_COLUMNS } from '../services/upload-row';
import { DragData } from '../services/drag-drop.directive';
import { Totals } from '../services/adrese-box';
import { ColorTotals } from 'src/app/interfaces';
import { Subject, ReplaySubject, combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

/**
 * Forma ķekšišu elementiem
 */
class CheckFormGroup extends FormGroup {
  // Ievilkto ķesīšu skaits
  get checked(): number {
    return Object.keys(this.value).reduce((count, val) => {
      if (this.value[val]) { count++; }
      return count;
    }, 0);
  }
}

@Component({
  selector: 'app-upload-adreses',
  templateUrl: './upload-adreses.component.html',
  styleUrls: ['./upload-adreses.component.css']
})
export class UploadAdresesComponent implements OnInit {
  @Output() gatavs: Subject<Totals | undefined> = new Subject();
  @Input() set plannedTotals(_val: ColorTotals[]) {
    if (_val) { this.plannedTotals$.next(_val); }
  }

  displayedColumns: string[];
  displayedDataColumns: string[];
  checkCols: CheckFormGroup;
  checkSkaitiPakas = new FormControl(true);
  colChipsAvailable: string[]; // Vajadzīgo sleju nosaukumi
  colChipsAssigned: Map<string, string> = new Map();
  rowSelection: SelectionModel<any> = new SelectionModel<any>(true);
  tableComplete = false;

  plannedTotals$ = new ReplaySubject<ColorTotals[]>(1);
  totals$ = this.combineTotals(this.gatavs, this.plannedTotals$);

  constructor(
    private uploadService: UploadService,
  ) { }

  datasource$ = this.uploadService.adresesCsv$;
  ngOnInit() {
    this.setColNames();
    this.resetChips();
    this.toCheckGroup();
  }

  onDeleteColumns() {
    this.resetChips();
    this.uploadService.deleteAdresesCsvColumns(this.checkCols.value);
    this.setColNames();
    this.rowSelection.clear();
    this.checkCols.reset();
    this.gatavs.next(undefined);
  }

  onJoinColumns() {
    this.resetChips();
    this.uploadService.joinAdresesCsvColumns(this.checkCols.value);
    this.setColNames();
    this.rowSelection.clear();
    this.checkCols.reset();
    this.gatavs.next(undefined);
  }

  onDeleteRows() {
    this.uploadService.deleteCsvRows(this.rowSelection.selected);
    this.rowSelection.clear();
    this.gatavs.next(undefined);
  }

  onAddEmptyColumn() {
    this.uploadService.addEmptyColumn();
    this.setColNames();
    this.toCheckGroup();
  }

  onCalculate() { // Veidot pakošanas sarakstu un iet tālāk
    this.uploadService.adresesToKastes(
      this.colChipsAssigned,
      this.checkSkaitiPakas.value
    );
    this.gatavs.next(this.uploadService.adresesTotals);
  }

  onDrop(data: DragData, col: string) {
    if (data.source !== 'primary') { // Ja kustība nav no sākuma rindas
      this.removeChip(data); // tad noņem no esošās vietas un uzliek sākuma rindā
    }
    if (this.colChipsAssigned.has(col)) { // Ja sleja aizņemta
      this.removeChip({ text: this.colChipsAssigned.get(col), source: col });
    }
    this.colChipsAvailable.splice(this.colChipsAvailable.indexOf(data.text), 1); // Izņem no sākuma rindas
    this.colChipsAssigned.set(col, data.text);
    this.tableComplete = !this.colChipsAvailable.length;
  }

  onChipRemove(col: string) {
    this.removeChip({ text: this.colChipsAssigned.get(col), source: col });
  }
  /**
   * Noņem čipu no stabiņiem
   * @param name čipa nosaukums
   * @param col slejas indekss, kurai piesaistīts čips.
   */
  removeChip(data: DragData) {
    if (data.source === 'primary') {
      return;
    }
    this.colChipsAvailable.push(data.text);
    this.colChipsAssigned.delete(data.source);
    this.tableComplete = false;
  }
  /**
   * Noņem čipus no slejām, kuras likvidējamas
   * @param colMap slejas nosaukums : boolean - true: sleja izmetama
   */
  removeColChips(colMap: {}) {
    this.colChipsAssigned.forEach(
      (val, key) => this.removeChip({ text: val, source: key })
    );
  }
  /**
   * Izveido masīvus ar parādāmo sleju nosaukumiem - displayedDataColumns un displayedColumns
   */
  private setColNames() {
    this.displayedDataColumns = this.uploadService.colNames;
    this.displayedColumns = ['selected', ...this.displayedDataColumns];
  }
  /**
   * Izveido FormControl grupu ar sleju iezīmēšanas lauciņiem
   * Priekš displayedDataColumns laukiem
   */
  private toCheckGroup() {
    const control = {};
    for (const col of this.displayedDataColumns) {
      control[col] = new FormControl(false);
    }
    this.checkCols = new CheckFormGroup(control);
  }

  private resetChips() {
    this.colChipsAvailable = [...TABLE_COLUMNS];
    this.colChipsAssigned.clear();
  }

  private combineTotals(
    totals$: Observable<Totals | undefined>,
    planned$: Observable<ColorTotals[]>):
    Observable<Totals & {
      planned:
      { yellow: number; rose: number; white: number; };
    }> {
    return combineLatest([totals$, planned$]).pipe(
      map(([totals, planned]) => totals ? {
        ...totals,
        planned: {
          yellow: planned.find(col => col.color === 'yellow')?.total || 0,
          rose: planned.find(col => col.color === 'rose')?.total || 0,
          white: planned.find(col => col.color === 'white')?.total || 0,
        }
      } : undefined
      ),
    );
  }
}
