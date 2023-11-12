import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { DestroyService } from 'src/app/library/rxjs';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { PaytraqConnectionParams, PaytraqSettings } from 'src/app/interfaces';
import { PreferencesCardControl } from '../../preferences-card-control';

@Component({
  selector: 'app-paytraq-preferences',
  templateUrl: './paytraq-preferences.component.html',
  styleUrls: ['./paytraq-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: PreferencesCardControl,
      useExisting: PaytraqPreferencesComponent,
    },
    DestroyService,
  ],
})
export class PaytraqPreferencesComponent
  implements
    OnInit,
    OnDestroy,
    PreferencesCardControl<Required<PaytraqSettings>>
{
  set value(value: PaytraqSettings) {
    this.controls.reset(value);
    this.stateChanges.next();
  }
  get value(): PaytraqSettings {
    return this.controls.getRawValue();
  }

  stateChanges = new Subject<void>();

  controls = new FormGroup({
    enabled: new FormControl(false),
    connectionParams: new FormControl<PaytraqConnectionParams>(undefined, [
      this.connectionParamsValidator,
    ]),
  });

  paramsValid$: Observable<boolean> =
    this.controls.controls.connectionParams.statusChanges.pipe(
      map((status) => status === 'VALID')
    );

  constructor(private destroy$: DestroyService) {}

  ngOnInit(): void {
    this.controls.controls.connectionParams.statusChanges
      .pipe(
        map((status) => status === 'VALID'),
        takeUntil(this.destroy$)
      )
      .subscribe((valid) => {
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

  connectionParamsValidator(
    control: AbstractControl<PaytraqConnectionParams>
  ): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return { missing: 'all' };
    }
    for (const k of Object.keys(value)) {
      const v: string = value[k];
      if (!v?.length) {
        return { missing: k };
      }
    }
    return null;
  }
}
