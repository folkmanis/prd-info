import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, output } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { TransportationCustomer } from 'src/app/transportation/interfaces/transportation-customer';
import { RouteTrip } from 'src/app/transportation/interfaces/transportation-route-sheet';
import { SingleTripComponent } from './single-trip/single-trip.component';
import { MatCardModule } from '@angular/material/card';
import { TransportationVehicle } from 'src/app/transportation/interfaces/transportation-vehicle';

@Component({
  selector: 'app-route-trips',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatButton, SingleTripComponent, MatCardModule],
  templateUrl: './route-trips.component.html',
  styleUrl: './route-trips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RouteTripsComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: RouteTripsComponent,
      multi: true,
    },
  ],
})
export class RouteTripsComponent implements ControlValueAccessor, Validator {
  private chDetector = inject(ChangeDetectorRef);

  form = new FormArray<FormControl<RouteTrip>>([]);

  customers = input<TransportationCustomer[]>([]);

  vehicle = input<TransportationVehicle | null>();

  onTouched = () => {};

  writeValue(obj: RouteTrip[] | null): void {
    if (obj?.length === this.form.length) {
      this.form.reset(obj, { emitEvent: false });
    } else {
      this.form.clear({ emitEvent: false });
      obj?.forEach((trip) => this.form.push(new FormControl(trip), { emitEvent: false }));
    }
    this.chDetector.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
  }

  validate(): ValidationErrors | null {
    if (this.form.valid) {
      return null;
    } else {
      return this.form.controls.reduce((errors, control, idx) => (control.invalid ? { ...errors, [idx]: control.errors } : errors), {});
    }
  }

  onAppend() {
    const tripControl = new FormControl(null, [Validators.required]);
    this.form.push(tripControl);
    this.onTouched();
    this.chDetector.markForCheck();
  }

  onRemove(index: number) {
    this.form.removeAt(index);
    this.onTouched();
    this.chDetector.markForCheck();
  }
}
