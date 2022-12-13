import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { BehaviorSubject, EMPTY, merge, Observable, of, Subject } from 'rxjs';
import { map, mergeAll, mergeMap, shareReplay, skip, takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from 'prd-cdk';

enum Action { ADD, REMOVE, UPDATE }
interface UpdateAction<T> { type: Action; data?: T; idx?: number; }

@Component({
  selector: 'app-simple-list-table',
  templateUrl: './simple-list-table.component.html',
  styleUrls: ['./simple-list-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DestroyService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SimpleListTableComponent,
      multi: true,
    }
  ],
})
export class SimpleListTableComponent<T, K extends keyof T & string> implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() set columns(columns: K[]) {
    this._columns = columns;
    this.displayedColumns = ['button', ...columns];
  }
  get columns(): K[] { return this._columns; }
  private _columns: K[] = [];

  @Input() editDialog: ComponentType<any>;

  @Input() set disabled(disabled: boolean) { this._disabled = disabled; }
  get disabled(): boolean { return this._disabled; }
  private _disabled = false;

  private updateFn: (obj: T[]) => void = () => { };
  private touchedFn: () => void = () => { };

  displayedColumns: (keyof T | 'button')[] = [];


  private _initialData$ = new BehaviorSubject<T[]>([]);
  private _updateData$ = new Subject<UpdateAction<T>>();

  data$: Observable<T[]> = this._initialData$.pipe(
    map(data => merge(
      of(data),
      this._updateData$.pipe(
        map(upd => data = this.updateData(upd, data))
      ),
    )),
    mergeAll(),
    shareReplay(1),
  );

  constructor(
    private destroy$: DestroyService,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
  ) { }

  writeValue(obj: T[]) {
    this._initialData$.next(obj || []);
  }

  registerOnChange(fn: (obj: T[]) => void) {
    this.updateFn = fn;
  }

  registerOnTouched(fn: () => void) {
    this.touchedFn = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this.changeDetector.markForCheck();
  }

  ngOnInit(): void {
    this.data$.pipe(
      skip(1),
      takeUntil(this.destroy$)
    )
      .subscribe(data => this.updateFn(data));
  }

  ngOnDestroy(): void {
    this._updateData$.complete();
  }

  onAddRow() {
    if (!this.editDialog) { return; }
    const dialogRef = this.dialog.open<any, T, T | undefined>(this.editDialog);
    dialogRef.afterClosed().pipe(
      tap(_ => this.touchedFn()),
      mergeMap(resp => resp ? of(resp) : EMPTY),
      takeUntil(this.destroy$),
    ).subscribe(cat => {
      this._updateData$.next({ type: Action.ADD, data: cat });
    });
  }

  onEditRow(obj: T, idx: number) {
    if (this.disabled || !this.editDialog) { return; }
    const dialogRef = this.dialog
      .open<any, T, T | undefined>(this.editDialog, { data: obj });
    dialogRef.afterClosed().pipe(
      tap(_ => this.touchedFn()),
      mergeMap(resp => resp ? of(resp) : EMPTY),
      takeUntil(this.destroy$),
    ).subscribe(cat => {
      this._updateData$.next({ type: Action.UPDATE, data: { ...obj, ...cat }, idx });
    });
  }

  onRemoveRow(idx: number) {
    this._updateData$.next({ type: Action.REMOVE, idx });
    this.touchedFn();
  }

  private updateData({ type, data, idx }: UpdateAction<T>, dataArray: T[]): T[] {
    if (type === Action.ADD) {
      return [...dataArray, data];
    }
    if (type === Action.REMOVE && typeof idx === 'number') {
      return dataArray.filter((_, i) => i !== idx);
    }
    if (type === Action.UPDATE && typeof idx === 'number' && data) {
      return dataArray.map((d, i) => i === idx ? data : d);
    }
    return dataArray;
  }

}
