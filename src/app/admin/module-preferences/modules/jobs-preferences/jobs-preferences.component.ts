import { ChangeDetectionStrategy, OnInit, Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IFormArray, IFormBuilder, IFormGroup } from '@rxweb/types';
import { EMPTY, of, Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { JobsSettings, ProductCategory } from 'src/app/interfaces';
import { PreferencesCardControl } from '../../preferences-card-control';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';

type JobsSettingsControls = Pick<JobsSettings, 'productCategories'>;

@Component({
  selector: 'app-jobs-preferences',
  templateUrl: './jobs-preferences.component.html',
  styleUrls: ['./jobs-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: PreferencesCardControl, useExisting: JobsPreferencesComponent }]
})
export class JobsPreferencesComponent implements PreferencesCardControl<JobsSettings>, OnInit, OnDestroy {

  get value(): JobsSettingsControls {
    return this.controls.value;
  }
  set value(obj: JobsSettingsControls) {
    this.controls.patchValue(obj);
    this.stateChanges.next();
  }

  categoryDialog = CategoryDialogComponent;

  private fb: IFormBuilder;

  controls: IFormGroup<JobsSettingsControls>;

  stateChanges = new Subject<void>();

  constructor(
    fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.fb = fb;
    this.controls = this.fb.group<JobsSettingsControls>(
      {
        productCategories: [],
      }
    );
  }

  ngOnInit() {
    this.stateChanges.subscribe(_ => this.changeDetector.markForCheck());
  }

  ngOnDestroy() {
    this.stateChanges.complete();
  }

}
