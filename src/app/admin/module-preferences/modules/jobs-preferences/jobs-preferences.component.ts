import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { JobsSettings, ProductCategory, ProductUnit } from 'src/app/interfaces';
import { PreferencesCardControl } from '../../preferences-card-control';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { UnitsDialogComponent } from './units-dialog/units-dialog.component';

type JobsSettingsControls = Pick<JobsSettings, 'productCategories' | 'productUnits'>;

@Component({
  selector: 'app-jobs-preferences',
  templateUrl: './jobs-preferences.component.html',
  styleUrls: ['./jobs-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: PreferencesCardControl, useExisting: JobsPreferencesComponent }]
})
export class JobsPreferencesComponent implements PreferencesCardControl<JobsSettingsControls>, OnInit, OnDestroy {

  controls = new FormGroup({
    productCategories: new FormControl<ProductCategory[]>([]),
    productUnits: new FormControl<ProductUnit[]>([])
  });

  stateChanges = new Subject<void>();

  get value(): JobsSettingsControls {
    return this.controls.getRawValue();
  }
  set value(obj: JobsSettingsControls) {
    this.controls.patchValue(obj);
    this.stateChanges.next();
  }


  categoryDialog = CategoryDialogComponent;
  unitsDialog = UnitsDialogComponent;

  constructor(
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.controls;
    this.stateChanges.subscribe(_ => this.changeDetector.markForCheck());
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

}
