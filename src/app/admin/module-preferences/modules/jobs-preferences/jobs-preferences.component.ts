import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { Subject } from 'rxjs';
import { JobsSettings } from 'src/app/interfaces';
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
export class JobsPreferencesComponent implements PreferencesCardControl<JobsSettings>, OnInit, OnDestroy {

  controls: IFormGroup<JobsSettingsControls>;
  stateChanges = new Subject<void>();

  get value(): JobsSettingsControls {
    return this.controls.value;
  }
  set value(obj: JobsSettingsControls) {
    this.controls.patchValue(obj);
    this.stateChanges.next();
  }


  categoryDialog = CategoryDialogComponent;
  unitsDialog = UnitsDialogComponent;

  private fb: IFormBuilder;

  constructor(
    fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.fb = fb;
  }

  ngOnInit() {
    this.controls = this.fb.group<JobsSettingsControls>(
      {
        productCategories: [],
        productUnits: [],
      }
    );
    this.stateChanges.subscribe(_ => this.changeDetector.markForCheck());
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

}
