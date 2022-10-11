import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DestroyService } from 'prd-cdk';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Colors, COLORS, Kaste, MAX_ITEMS_BOX, Veikals } from 'src/app/kastes/interfaces';
import { getKastesPreferences } from '../../../services/kastes-preferences.service';
import { VeikalsValidationErrors } from '../../services/veikals-validation-errors';
import { ActiveVeikalsDirective } from '../active-veikals.directive';

type KasteGroup = {
  [key in keyof Kaste]: FormControl<Kaste[key]>
};

@Component({
  selector: 'app-veikals-edit',
  templateUrl: './veikals-edit.component.html',
  styleUrls: ['./veikals-edit.component.scss'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VeikalsEditComponent implements OnInit, OnDestroy {

  colors$ = getKastesPreferences('colors');
  readonly colorNames = COLORS;

  @Input() get veikals(): Veikals {
    return this._veikals;
  }
  set veikals(veikals: Veikals) {
    this._veikals = veikals;
    if (veikals?.kastes) {
      this.initForm(veikals.kastes);
    }
    this._veikals$.next(veikals);
  }
  private _veikals: Veikals;


  veikalsFormArray = new FormArray<FormGroup<KasteGroup>>(
    [],
    {
      validators: this.totalsValidator()
    }
  );

  private _veikals$ = new ReplaySubject<Veikals>(1);

  private _veikalsKastesChanges$ = this.veikalsFormArray.valueChanges.pipe(
    filter(_ => this.veikalsFormArray.valid),
    map(_ => this.recalculateTotals(this.veikalsFormArray.getRawValue())),
  );

  @Output()
  errors: Observable<null | VeikalsValidationErrors> = this.veikalsFormArray.valueChanges.pipe(
    map(_ => this.veikalsFormArray.valid ? null : this.veikalsFormArray.errors || {}),
  );

  @Output()
  valueChanges: Observable<Veikals> = combineLatest([
    this._veikalsKastesChanges$, this._veikals$,
  ]).pipe(
    map(([kastes, veikals]) => ({ ...veikals, kastes })),
  );


  constructor(
    @Inject(ActiveVeikalsDirective) private activeVeikals: ActiveVeikalsDirective,
    private destroy$: DestroyService,
  ) { }

  ngOnInit(): void {
    this.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(val => this.activeVeikals.veikalsUpdate = val);
    this.errors.pipe(
      takeUntil(this.destroy$),
    ).subscribe(err => this.activeVeikals.validationErrors = err);
  }

  ngOnDestroy(): void {
    this._veikals$.complete();
  }

  boxTotals(val: Kaste): number {
    return COLORS.reduce((acc, k) => acc + val[k], 0);
  }

  private recalculateTotals(kastes: Kaste[]): Kaste[] {
    return kastes.map(k => ({
      ...k,
      total: this.boxTotals(k),
    }));
  }

  private colorTotals(veikals: Kaste[]): { [key in Colors]: number; } {
    const tot: { [key in Colors]: number } = Object.assign({}, ...COLORS.map(col => ({ [col]: 0 })));
    for (const box of veikals) {
      for (const color of COLORS) {
        tot[color] += box[color];
      }
    }
    return tot;
  }

  private initForm(boxs: Kaste[]) {
    this.veikalsFormArray.clear();
    for (const box of boxs) {
      const boxForm = new FormGroup<KasteGroup>(
        {
          ...this.colorsControlsArray(box),
          total: new FormControl(box.total, { nonNullable: true }),
          gatavs: new FormControl(box.gatavs, { nonNullable: true }),
          uzlime: new FormControl(box.uzlime, { nonNullable: true }),
        },
        { validators: [this.maxItemsValidator(MAX_ITEMS_BOX)] }
      );
      if (box.gatavs) { boxForm.disable({ emitEvent: false }); }
      this.veikalsFormArray.push(boxForm);
    }
  }

  private colorsControlsArray(box: Kaste): { [key in Colors]: FormControl<number> } {
    return Object.assign(
      {},
      ...COLORS.map(col => ({
        [col]: new FormControl(
          box[col],
          {
            nonNullable: true,
            validators: [Validators.required, Validators.min(0), Validators.max(MAX_ITEMS_BOX)],
          }
        )
      }))
    );
  }

  private maxItemsValidator(maxItemsBox: number): ValidatorFn {
    return (control: AbstractControl<Kaste>): ValidationErrors => {
      const items = this.boxTotals(control.getRawValue());
      return items > maxItemsBox ? { maxItemsBox, items } : null;
    };
  }

  private totalsValidator(): ValidatorFn {
    return (control: FormArray<FormGroup<KasteGroup>>): ValidationErrors => {
      if (!this.veikals || control.value.length === 0) { return null; }
      const totals = this.colorTotals(control.getRawValue());
      const initTotals = this.colorTotals(this.veikals.kastes);
      const diff = Object.assign({},
        ...Object.keys(totals).map(col => ({ [col]: totals[col] - initTotals[col] })),
      );
      return Object.keys(diff).reduce((acc, curr) => acc || !!diff[curr], false) ? { diff } : null;
    };
  }

}
