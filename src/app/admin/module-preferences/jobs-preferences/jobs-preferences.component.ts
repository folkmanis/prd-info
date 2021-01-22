import { FocusMonitor } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { FormBuilder, NgControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IFormArray } from '@rxweb/types';
import { EMPTY, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { JobsSettings, ProductCategory } from 'src/app/interfaces';
import { AbstractPreferencesDirective } from '../abstract-preferences.directive';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';

type JobsSettingsControls = Pick<JobsSettings, 'productCategories'>;

@Component({
  selector: 'app-jobs-preferences',
  templateUrl: './jobs-preferences.component.html',
  styleUrls: ['./jobs-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsPreferencesComponent extends AbstractPreferencesDirective<JobsSettings> {

  constructor(
    protected cd: ChangeDetectorRef,
    private dialog: MatDialog,
    ngControl: NgControl,
    fb: FormBuilder,
    fm: FocusMonitor,
    elRef: ElementRef<HTMLElement>,
  ) {
    super(ngControl, fb, cd, fm, elRef);
    this.controls = this.fb.group<JobsSettingsControls>(
      {
        productCategories: this.fb.array<ProductCategory>([]),
      }
    );
  }

  get productCategories() { return this.controls.controls.productCategories as IFormArray<ProductCategory>; }

  protected writeControl(obj: JobsSettings) {
    this.controls.setControl('productCategories',
      this.fb.array<ProductCategory>(obj.productCategories)
    );
  }

  onNewCategory(): void {
    const dialogRef = this.dialog.open<CategoryDialogComponent, any, ProductCategory | undefined>(CategoryDialogComponent);
    dialogRef.afterClosed().pipe(
      mergeMap(resp => resp ? of(resp) : EMPTY),
    ).subscribe(cat => {
      this.productCategories.push(this.fb.group(cat));
      this.cd.markForCheck();
    });
  }

  onRemoveCategory(idx: number) {
    this.productCategories.removeAt(idx);
    this.cd.markForCheck();
  }

}
