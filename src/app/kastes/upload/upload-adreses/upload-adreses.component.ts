import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { UploadService } from '../services/upload.service';
import { TABLE_COLUMNS } from '../services/upload-row';
import { DragData } from '../services/drag-drop.directive';
import { Totals } from '../services/adrese-box';

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
export class UploadAdresesComponent implements OnInit, AfterViewInit {
  @Output() gatavs = new EventEmitter<boolean>();
  @ViewChild(MatTable) private table: MatTable<any>;
  displayedColumns: string[];
  displayedDataColumns: string[];
  checkCols: CheckFormGroup;
  checkSkaitiPakas = new FormControl(true);
  colChipsAvailable: string[]; // Vajadzīgo sleju nosaukumi
  colChipsAssigned: Map<string, string> = new Map();
  rowSelection: SelectionModel<any> = new SelectionModel<any>(true);
  tableComplete = false;
  totals: Totals;

  constructor(
    private uploadService: UploadService,
  ) { }

  ngOnInit() {
    this.setColNames();
    this.resetChips();
    this.toCheckGroup();
  }

  ngAfterViewInit() {
    this.table.dataSource = this.uploadService.adresesCsv;
  }

  onDeleteColumns() {
    this.resetChips();
    this.uploadService.deleteAdresesCsvColumns(this.checkCols.value);
    this.setColNames();
    this.rowSelection.clear();
    this.checkCols.reset();
    this.gatavs.emit(false);
  }

  onJoinColumns() {
    this.resetChips();
    this.uploadService.joinAdresesCsvColumns(this.checkCols.value);
    this.setColNames();
    this.rowSelection.clear();
    this.checkCols.reset();
    this.gatavs.emit(false);
  }

  onDeleteRows() {
    this.uploadService.deleteCsvRows(this.rowSelection.selected);
    this.rowSelection.clear();
    this.gatavs.emit(false);
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
    this.totals = this.uploadService.adresesTotals;
    this.gatavs.emit(true);
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
}
