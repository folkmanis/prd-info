import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { IFormBuilder, IControlValueAccessor, IFormArray } from '@rxweb/types';
import { JobsSettings, ProductCategory } from 'src/app/interfaces';
import { ControlValueAccessor, FormBuilder, NgControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, of, BehaviorSubject, Subject, Observable, merge } from 'rxjs';
import { map, mergeAll, mergeMap, share, shareReplay, skip, takeUntil, tap } from 'rxjs/operators';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
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
export class JobCategoriesComponent implements OnInit, OnDestroy, IControlValueAccessor<ProductCategory[]> {
@Input() columns: string[] = [];

  private updateFn: (obj: ProductCategory[]) => void;
  private touchedFn: () => void;

  displayedColumns: (keyof ProductCategory | 'button')[] = ['button', 'category', 'description'];

  disabled = false;

  private _initialCategories$ = new BehaviorSubject<ProductCategory[]>([]);
  private _updateData$ = new Subject<UpdateAction<ProductCategory>>();

  categories$: Observable<ProductCategory[]> = this._initialCategories$.pipe(
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

  writeValue(obj: ProductCategory[]) {
    this._initialCategories$.next(obj || []);
  }

  registerOnChange(fn: (obj: ProductCategory[]) => void) {
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
    const dialogRef = this.dialog.open<CategoryDialogComponent, any, ProductCategory | undefined>(CategoryDialogComponent);
    dialogRef.afterClosed().pipe(
      tap(_ => this.touchedFn()),
      mergeMap(resp => resp ? of(resp) : EMPTY),
      takeUntil(this.destroy$),
    ).subscribe(cat => {
      this._updateData$.next({ type: Action.ADD, data: cat });
    });
  }

  onEditRow(obj: ProductCategory, idx: number) {
    if (this.disabled) { return; }
    const dialogRef = this.dialog
      .open<CategoryDialogComponent, ProductCategory, ProductCategory | undefined>(CategoryDialogComponent, { data: obj });
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

  private updateData<T>({ type, data, idx }: UpdateAction<T>, dataArray: T[]): T[] {
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
