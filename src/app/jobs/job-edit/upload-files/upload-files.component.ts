import { Component, Input, Output, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ReplaySubject, combineLatest, Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { map, tap, shareReplay, share } from 'rxjs/operators';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFilesComponent implements OnInit, OnDestroy {
  @Input('files') set files(val: File[]) {
    this._files = val;
    /* Ignorē folderus un tukšus datus */
    console.log(val);
    if (!val?.filter(file => file.size).length) { return; }
    this.selection.select(...val);
    this.files$.next(val);
  }
  get files(): File[] { return this._files; }
  private _files: File[] = [];

  selection = new SelectionModel<File>(true);
  @Output() filesChange: Observable<File[]> = this.selection.changed.pipe(
    map(sel => sel.source.selected),
    share(),
  );

  files$ = new ReplaySubject<File[]>(1);
  readonly columnsToDisplay = [
    'selector',
    'name',
    'lastModifiedDate',
    'size',
    'type',
  ];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.files$.complete();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.files.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.files.forEach(row => this.selection.select(row));
  }

}
