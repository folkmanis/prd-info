import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { IFormBuilder, IControlValueAccessor, IFormArray } from '@rxweb/types';
import { JobsSettings, ProductCategory } from 'src/app/interfaces';
import { ControlValueAccessor, FormBuilder, NgControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EMPTY, of, BehaviorSubject, Subject, Observable, merge } from 'rxjs';
import { map, mergeAll, mergeMap, share, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { DestroyService } from 'src/app/library/rx';

@Component({
  selector: 'app-job-categories',
  templateUrl: './job-categories.component.html',
  styleUrls: ['./job-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class JobCategoriesComponent implements OnInit, IControlValueAccessor<ProductCategory[]> {

  private updateFn: (obj: ProductCategory[]) => void;
  private touchedFn: () => void;

  displayedColumns: (keyof ProductCategory | 'button')[] = ['button', 'category', 'description'];

  private _initialCategories$ = new BehaviorSubject<ProductCategory[]>([]);

  disabled$ = new BehaviorSubject<boolean>(false);

  newCategorie$ = new Subject<ProductCategory>();
  removeCategorie$ = new Subject<ProductCategory>();
  updateCategorie$ = new Subject<ProductCategory>();

  categories$: Observable<ProductCategory[]> = this._initialCategories$.pipe(
    map(categories => merge(
      of(categories),
      this.newCategorie$.pipe(
        map(newCat => categories = [...categories, newCat]),
      ),
      this.removeCategorie$.pipe(
        map(categorie => categories = categories.filter(c => c !== categorie)),
      ),
      this.updateCategorie$.pipe(
        map(catUpd => categories = categories.map(c => c.category === catUpd.category ? catUpd : c)),
      )
    )),
    mergeAll(),
    shareReplay(),
  );

  constructor(
    control: NgControl,
    private destroy$: DestroyService,
    private dialog: MatDialog,
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
    this.disabled$.next(isDisabled);
  }

  ngOnInit(): void {
    this.categories$.pipe(takeUntil(this.destroy$))
      .subscribe(categories => this.updateFn(categories));
  }

  onAddCategoy() {
    const dialogRef = this.dialog.open<CategoryDialogComponent, any, ProductCategory | undefined>(CategoryDialogComponent);
    dialogRef.afterClosed().pipe(
      tap(_ => this.touchedFn()),
      mergeMap(resp => resp ? of(resp) : EMPTY),
      takeUntil(this.destroy$),
    ).subscribe(cat => {
      this.newCategorie$.next(cat);
    });
  }

  onEditCategory(obj: ProductCategory) {
    const dialogRef = this.dialog
      .open<CategoryDialogComponent, ProductCategory, ProductCategory | undefined>(CategoryDialogComponent, { data: obj });
    dialogRef.afterClosed().pipe(
      tap(_ => this.touchedFn()),
      mergeMap(resp => resp ? of(resp) : EMPTY),
      takeUntil(this.destroy$),
    ).subscribe(cat => {
      this.updateCategorie$.next({ ...obj, ...cat });
    });
  }

  onRemoveCategory(obj: ProductCategory) {
    this.removeCategorie$.next(obj);
    this.touchedFn();
  }

}
