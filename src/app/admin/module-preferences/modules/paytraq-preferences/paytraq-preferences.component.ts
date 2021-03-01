import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { PaytraqSettings, PaytraqConnectionParams } from 'src/app/interfaces';
import { PreferencesCardControl } from '../../preferences-card-control';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { IFormBuilder, IFormControl, IFormGroup } from '@rxweb/types';
import { map, takeUntil } from 'rxjs/operators';
import { DestroyService } from 'prd-cdk';

@Component({
  selector: 'app-paytraq-preferences',
  templateUrl: './paytraq-preferences.component.html',
  styleUrls: ['./paytraq-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: PreferencesCardControl, useExisting: PaytraqPreferencesComponent },
    DestroyService,
  ]
})
export class PaytraqPreferencesComponent implements OnInit, OnDestroy, PreferencesCardControl<PaytraqSettings> {

  set value(value: PaytraqSettings) {
    this.controls.reset();
    this.controls.patchValue(value);
    this.stateChanges.next();
  }
  get value(): PaytraqSettings {
    return this.controls.value;
  }
  stateChanges = new Subject<void>();
  controls: IFormGroup<PaytraqSettings>;
  private fb: IFormBuilder;

  paramsValid$: Observable<boolean>;

  constructor(
    fb: FormBuilder,
    private destroy$: DestroyService,
  ) {
    this.fb = fb;
    this.controls = this.fb.group<PaytraqSettings>(
      {
        enabled: [false],
        connectionParams: [undefined, this.connectionParamsValidator],
      }
    );
    this.paramsValid$ = this.controls.controls.connectionParams.statusChanges.pipe(
      map(status => status === 'VALID')
    );
  }

  ngOnInit(): void {
    this.controls.controls.connectionParams.statusChanges.pipe(
      map(status => status === 'VALID'),
      takeUntil(this.destroy$),
    ).subscribe(valid => {
      if (valid) {
        this.controls.controls.enabled.enable();
      } else {
        this.controls.controls.enabled.disable();
        this.controls.controls.enabled.setValue(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  connectionParamsValidator(control: IFormControl<PaytraqConnectionParams>): ValidationErrors | null {
    const value = control.value;
    if (!value) { return { missing: 'all' }; }
    for (const k of Object.keys(value)) {
      const v: string = value[k];
      if (!v?.length) { return { missing: k }; }
    }
    return null;
  }


}
