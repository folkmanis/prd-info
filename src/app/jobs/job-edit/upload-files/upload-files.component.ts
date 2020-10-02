import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFilesComponent implements OnInit, OnDestroy {
  @Input() files: File[];

  @Input() set disabled(val: boolean) {
    this._disabled = Boolean(val);
  }
  get disabled(): boolean { return this._disabled; }
  private _disabled = false;

  selection = new SelectionModel<File>(true);
  @Output() filesChange: Observable<File[]> = this.selection.changed.pipe(
    map(sel => sel.source.selected),
    share(),
  );

  readonly columnsToDisplay = [
    'selector',
    'name',
    'lastModifiedDate',
    'size',
    'type',
  ];

  filesTable: File[];

  constructor() { }

  ngOnInit(): void {
    /* Ignorē folderus un tukšus datus */
    this.filesTable = this.files?.filter(file => file.size) || [];
    this.selection.select(...this.filesTable);
  }

  ngOnDestroy(): void {
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.files.length;
    return numSelected === numRows && numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.selection.select(...this.filesTable);
  }

  totalBytes(): number {
    return this.selection.selected.reduce((acc, curr) => acc + curr.size, 0);
  }

}
