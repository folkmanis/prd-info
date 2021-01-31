import { ComponentType } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IControlValueAccessor } from '@rxweb/types';
import { BehaviorSubject, EMPTY, merge, Observable, of, Subject } from 'rxjs';
import { map, mergeAll, mergeMap, shareReplay, skip, takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from 'src/app/library/rx';

enum Action { ADD, REMOVE, UPDATE }
interface UpdateAction<T> { type: Action; data?: T; idx?: number; }

@Component({
  selector: 'app-job-categories',
  templateUrl: './job-categories.component.html',
  styleUrls: ['./job-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class JobCategoriesComponent<T> implements OnInit, OnDestroy, IControlValueAccessor<T[]> {
  @Input() set columns(columns: (keyof T)[]) {
    this._columns = columns;
    this.displayedColumns = ['button', ...columns];
  }
  get columns(): (keyof T)[] { return this._columns; }
  private _columns: (keyof T)[] = [];

  @Input() editDialog: ComponentType<any>;

  @Input() set disabled(disabled: boolean) { this._disabled = disabled; }
  get disabled(): boolean { return this._disabled; }
  private _disabled = false;

  private updateFn: (obj: T[]) => void;
  private touchedFn: () => void;

  displayedColumns: (keyof T | 'button')[] = [];


  private _initialCategories$ = new BehaviorSubject<T[]>([]);
  private _updateData$ = new Subject<UpdateAction<T>>();

  categories$: Observable<T[]> = this._initialCategories$.pipe(
    map(categories => merge(
      of(categories),
      this._updateData$.pipe(
        map(upd => categories = this.updateData(upd, categories))
      ),
    )),
    mergeAll(),
    shareReplay(1),
  );

  constructor(
    control: NgControl,
    private destroy$: DestroyService,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
  ) {
    control.valueAccessor = this;
  }

  writeValue(obj: T[]) {
    this._initialCategories$.next(obj || []);
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
    this.categories$.pipe(
      skip(1),
      takeUntil(this.destroy$)
    )
      .subscribe(categories => this.updateFn(categories));
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
