import { ChangeDetectionStrategy, Component, ElementRef, Input, Output, Signal, afterNextRender, computed, output, signal, viewChildren } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Observable, filter, map } from 'rxjs';
import { COLORS, Colors } from 'src/app/interfaces';
import { Kaste, MAX_ITEMS_BOX, Veikals } from 'src/app/kastes/interfaces';
import { InputDirective } from 'src/app/library/directives/input.directive';
import { kastesPreferences } from '../../../services/kastes-preferences.service';
import { VeikalsValidationErrors } from '../../services/veikals-validation-errors';

type ColorsGroup = FormGroup<{
  [color in Colors]: FormControl<number>;
}>;

@Component({
  selector: 'app-veikals-edit',
  templateUrl: './veikals-edit.component.html',
  styleUrls: ['./veikals-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule, InputDirective],
})
export class VeikalsEditComponent {
  private fb = new FormBuilder().nonNullable;
  private inputElements = viewChildren<ElementRef<HTMLInputElement>>('boxInput');

  boxTotals = boxTotals;

  colorCodes = kastesPreferences('colors');

  colors = COLORS;

  save = output<void>();

  @Input() set veikals(value: Veikals) {
    this.initForm(value.kastes);
    this.veikalsInitial.set(value);
  }

  form = new FormArray<ColorsGroup>([]);

  private veikalsInitial = signal<Veikals | null>(null);

  private formValue = toSignal(this.form.valueChanges, { initialValue: [] });

  private veikalsValueChanges: Signal<Veikals | null> = computed(() => {
    const veikals = this.veikalsInitial();
    if (veikals) {
      this.formValue();
      const kastes = veikals.kastes.map((kaste, idx) => this.updateKaste(kaste, this.form.getRawValue()[idx]));
      return { ...veikals, kastes };
    } else {
      return null;
    }
  });

  @Output()
  errors: Observable<null | VeikalsValidationErrors> = this.form.valueChanges.pipe(map((_) => (this.form.valid ? null : this.form.errors || {})));

  @Output()
  valueChanges: Observable<Veikals> = toObservable(this.veikalsValueChanges).pipe(filter((value) => value !== null));

  constructor() {
    afterNextRender({
      write: () => {
        const input = this.inputElements()[0]?.nativeElement;
        if (input) {
          input.focus();
          input.select();
        }
      },
    });
  }

  onSave() {
    if (this.form.valid) {
      this.save.emit();
    }
  }

  private updateKaste(initial: Kaste, update: Record<Colors, number>): Kaste {
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
        control.disable({ emitEvent: false });
      }
      this.form.push(control, { emitEvent: false });
    }

    this.form.updateValueAndValidity();
  }

  private colorsControlGroup(kaste: Record<Colors, number>): ColorsGroup {
    const colors = COLORS.map((color) => ({
      [color]: [kaste[color], [Validators.required, Validators.min(0), Validators.max(MAX_ITEMS_BOX)]],
    }));
    const controls: { [key in Colors]: [number, ValidatorFn[]] } = Object.assign({}, ...colors);
    return this.fb.group(controls, {
      validators: [maxItemsValidator(MAX_ITEMS_BOX)],
    });
  }
}

function colorTotals(kastes: Record<Colors, number>[]): Record<Colors, number> {
  const tot: Record<Colors, number> = Object.assign({}, ...COLORS.map((col) => ({ [col]: 0 })));
  for (const box of kastes) {
    for (const color of COLORS) {
      tot[color] += box[color];
    }
  }
  return tot;
}

function totalsValidator(kastes: Record<Colors, number>[]): ValidatorFn {
  return (control) => {
    if (control.value.length === 0) {
      return null;
    }

    const totals = colorTotals(control.getRawValue());
    const initTotals = colorTotals(kastes);

    const diff: Record<Colors, number> = Object.assign({}, ...COLORS.map((col) => ({ [col]: totals[col] - initTotals[col] })));

    if (COLORS.some((color) => diff[color] !== 0)) {
      return { diff };
    } else {
      return null;
    }
  };
}

function maxItemsValidator(maxItemsBox: number): ValidatorFn {
  return (control) => {
    const items = boxTotals(control.getRawValue());
    return items > maxItemsBox ? { maxItemsBox, items } : null;
  };
}

function boxTotals(val: Record<Colors, number>): number {
  return COLORS.reduce((acc, k) => acc + val[k], 0);
}
