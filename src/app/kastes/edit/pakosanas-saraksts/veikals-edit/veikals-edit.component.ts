import { Component, OnInit, Input, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { VeikalsWithTotals } from '../../services/veikals-totals';
import { IFormBuilder, IFormGroup, IFormArray } from '@rxweb/types';
import { VeikalsBox, Colors, COLORS, MAX_ITEMS_BOX, Veikals } from 'src/app/interfaces';
import { KastesPreferencesService } from '../../../services/kastes-preferences.service';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { ControlConfig } from '@rxweb/types/reactive-form/control-config';
import { Observable, ReplaySubject, combineLatest } from 'rxjs';
import { ActiveVeikalsDirective } from '../active-veikals.directive';
import { VeikalsValidationErrors } from '../../services/veikals-validation-errors';
import { DestroyService } from 'src/app/library/rx/destroy.service';

@Component({
  selector: 'app-veikals-edit',
  templateUrl: './veikals-edit.component.html',
  styleUrls: ['./veikals-edit.component.scss'],
  providers: [DestroyService],
})
export class VeikalsEditComponent implements OnInit, OnDestroy {
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

  @Output() valueChanges: Observable<Veikals>;
  @Output() errors: Observable<null | VeikalsValidationErrors>;

  get valid(): boolean {
    return this.veikalsFormArray.valid;
  }

  fb: IFormBuilder;
  veikalsFormArray: IFormArray<VeikalsBox>;

  private _veikals$ = new ReplaySubject<Veikals>(1);
  private _veikalsKastesChanges$: Observable<VeikalsBox[]>;

  constructor(
    fb: FormBuilder,
    private prefService: KastesPreferencesService,
    @Inject(ActiveVeikalsDirective) private activeVeikals: ActiveVeikalsDirective,
    private destroy$: DestroyService,
  ) {
    this.fb = fb;
    this.veikalsFormArray = this.fb.array<VeikalsBox>([], { validators: this.totalsValidator() });
    this._veikalsKastesChanges$ = this.veikalsFormArray.valueChanges.pipe(
      filter(_ => this.veikalsFormArray.valid),
      map(_ => this.recalculateTotals(this.veikalsFormArray.getRawValue())),
    );
    this.errors = this.veikalsFormArray.valueChanges.pipe(
      map(_ => this.veikalsFormArray.valid ? null : this.veikalsFormArray.errors || {}),
    );
    this.valueChanges = combineLatest([
      this._veikalsKastesChanges$, this._veikals$,
    ]).pipe(
      map(([kastes, veikals]) => ({ ...veikals, kastes })),
    );
  }

  colors$ = this.prefService.preferences$.pipe(
    map(pref => pref.colors),
  );
  readonly colorNames = COLORS;

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

  boxTotals(val: VeikalsBox): number {
    return COLORS.reduce((acc, k) => acc + val[k], 0);
  }

  private recalculateTotals(kastes: VeikalsBox[]): VeikalsBox[] {
    return kastes.map(k => ({
      ...k,
      total: this.boxTotals(k),
    }));
  }

  private colorTotals(veikals: VeikalsBox[]): { [key in Colors]: number; } {
    const tot: { [key in Colors]: number } = Object.assign({}, ...COLORS.map(col => ({ [col]: 0 })));
    for (const box of veikals) {
      for (const color of COLORS) {
        tot[color] += box[color];
      }
    }
    return tot;
  }

  private initForm(boxs: VeikalsBox[]) {
    this.veikalsFormArray.clear();
    for (const box of boxs) {
      const boxForm = this.fb.group<VeikalsBox>(
        {
          ...this.colorsControlsArray(box),
          total: [box.total],
          gatavs: [box.gatavs],
          uzlime: [box.uzlime],
        },
        { validators: [this.maxItemsValidator(MAX_ITEMS_BOX)] }
      );
      if (box.gatavs) { boxForm.disable({ emitEvent: false }); }
      this.veikalsFormArray.push(boxForm);
    }
  }

  private colorsControlsArray(box: VeikalsBox): { [key in Colors]: ControlConfig<number> } {
    return Object.assign(
      {},
      ...COLORS.map(col => ({
        [col]:
          [
            box[col],
            [Validators.required, Validators.min(0), Validators.max(MAX_ITEMS_BOX)]
          ]
      }))
    );
  }

  private maxItemsValidator(maxItemsBox: number): ValidatorFn {
    return (control: IFormGroup<VeikalsBox>): ValidationErrors => {
      const items = this.boxTotals(control.value);
      return items > maxItemsBox ? { maxItemsBox, items } : null;
    };
  }

  private totalsValidator(): ValidatorFn {
    return (control: IFormArray<VeikalsBox>): ValidationErrors => {
      if (!this.veikals || control.value.length === 0) { return null; }
      const totals = this.colorTotals(control.value);
      const initTotals = this.colorTotals(this.veikals.kastes.filter(k => !k.gatavs));
      const diff = Object.assign({},
        ...Object.keys(totals).map(col => ({ [col]: totals[col] - initTotals[col] })),
      );
      return Object.keys(diff).reduce((acc, curr) => acc || !!diff[curr], false) ? { diff } : null;
    };
  }

}
