import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { PaytraqSettings } from 'src/app/interfaces';
import { PreferencesCardControl } from '../../preferences-card-control';
import { Subject } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';

@Component({
  selector: 'app-paytraq-preferences',
  templateUrl: './paytraq-preferences.component.html',
  styleUrls: ['./paytraq-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: PreferencesCardControl, useExisting: PaytraqPreferencesComponent }]
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

  constructor(
    fb: FormBuilder,
  ) { this.fb = fb; }

  ngOnInit(): void {
    this.controls = this.fb.group<PaytraqSettings>(
      {
        connectUrl: [undefined],
        connectKey: [undefined],
        apiUrl: [undefined],
        apiKey: [undefined],
        apiToken: [undefined],
      }
    );
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  onClear(key: keyof PaytraqSettings) {
    this.controls.get(key).reset();
    this.stateChanges.next();
  }

}
