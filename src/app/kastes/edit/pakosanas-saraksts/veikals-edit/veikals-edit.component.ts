import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  Signal,
  computed,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable, map } from 'rxjs';
import {
  COLORS,
  Colors,
  Kaste,
  KasteColors,
  MAX_ITEMS_BOX,
  Veikals,
} from 'src/app/kastes/interfaces';
import { InputDirective } from 'src/app/library/directives/input.directive';
import { getKastesPreferences } from '../../../services/kastes-preferences.service';
import { VeikalsValidationErrors } from '../../services/veikals-validation-errors';

type ColorsGroup = FormGroup<{
  [color in keyof KasteColors]: FormControl<KasteColors[color]>;
}>;

@Component({
  selector: 'app-veikals-edit',
  standalone: true,
  templateUrl: './veikals-edit.component.html',
  styleUrls: ['./veikals-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, InputDirective, AsyncPipe],
})
export class VeikalsEditComponent {
  boxTotals = boxTotals;

  colors$ = getKastesPreferences('colors');

  colorNames = COLORS;

  @Input() set veikals(value: Veikals) {
    this.initForm(value.kastes);
    this.veikalsInitial.set(value);
  }

  form = new FormArray<ColorsGroup>([]);

  private veikalsInitial = signal<Veikals | null>(null);

  private formValue = toSignal(this.form.valueChanges, { initialValue: [] });

  private veikalsValueChanges: Signal<Veikals> = computed(() => {
    const veikals = this.veikalsInitial();
    if (veikals) {
      const kastesColors = this.formValue() as KasteColors[];
      const kastes = veikals.kastes.map((kaste, idx) =>
        this.updateKaste(kaste, this.form.getRawValue()[idx])
      );
      return { ...veikals, kastes };
    }
  });

  @Output()
  errors: Observable<null | VeikalsValidationErrors> =
    this.form.valueChanges.pipe(
      map((_) => (this.form.valid ? null : this.form.errors || {}))
    );

  @Output()
  valueChanges: Observable<Veikals> = toObservable(this.veikalsValueChanges);

  constructor(private fb: FormBuilder) {}

  private updateKaste(initial: Kaste, update: KasteColors): Kaste {
    const total = boxTotals(update);
    return {
      ...initial,
      ...update,
      total,
    };
  }

  private initForm(kastes: Kaste[]) {
    this.form.clear();
    this.form.setValidators(totalsValidator(kastes));

    for (const kaste of kastes) {
      const control = this.colorsControlGroup(kaste);
      if (kaste.gatavs) {
        control.disable();
      }
      this.form.push(control, { emitEvent: false });
    }

    this.form.updateValueAndValidity();
  }

  private colorsControlGroup(kaste: KasteColors): ColorsGroup {
    const colors = COLORS.map((color) => ({
      [color]: [
        kaste[color],
        [Validators.required, Validators.min(0), Validators.max(MAX_ITEMS_BOX)],
      ],
    }));
    const controls: { [key in Colors]: [number, ValidatorFn[]] } =
      Object.assign({}, ...colors);
    return this.fb.nonNullable.group(controls, {
      validators: [maxItemsValidator(MAX_ITEMS_BOX)],
    });
  }
}

function colorTotals(kastes: KasteColors[]): KasteColors {
  const tot: KasteColors = Object.assign(
    {},
    ...COLORS.map((col) => ({ [col]: 0 }))
  );
  for (const box of kastes) {
    for (const color of COLORS) {
      tot[color] += box[color];
    }
  }
  return tot;
}

function totalsValidator(kastes: KasteColors[]): ValidatorFn {
  return (control: FormArray<ColorsGroup>): ValidationErrors => {
    if (control.value.length === 0) {
      return null;
    }

    const totals = colorTotals(control.getRawValue());
    const initTotals = colorTotals(kastes);

    const diff: KasteColors = Object.assign(
      {},
      ...COLORS.map((col) => ({ [col]: totals[col] - initTotals[col] }))
    );

    if (COLORS.some((color) => diff[color] !== 0)) {
      return { diff };
    } else {
      return null;
    }
  };
}

function maxItemsValidator(maxItemsBox: number): ValidatorFn {
  return (control: AbstractControl<Kaste>): ValidationErrors => {
    const items = boxTotals(control.getRawValue());
    return items > maxItemsBox ? { maxItemsBox, items } : null;
  };
}

function boxTotals(val: KasteColors): number {
  return COLORS.reduce((acc, k) => acc + val[k], 0);
}
