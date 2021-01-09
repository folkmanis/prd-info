import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { VeikalsWithTotals } from '../../services/veikals-totals';
import { IFormBuilder, IFormGroup, IFormArray } from '@rxweb/types';
import { VeikalsBox, Colors, COLORS, MAX_ITEMS_BOX } from 'src/app/interfaces';
import { KastesPreferencesService } from '../../../services/kastes-preferences.service';
import { filter, map, tap } from 'rxjs/operators';
import { ControlConfig } from '@rxweb/types/reactive-form/control-config';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-veikals-edit',
  templateUrl: './veikals-edit.component.html',
  styleUrls: ['./veikals-edit.component.scss']
})
export class VeikalsEditComponent implements OnInit {
  @Input() get veikals(): VeikalsWithTotals {
    return this._veikals;
  }
  set veikals(veikals: VeikalsWithTotals) {
    this._veikals = veikals;
    if (veikals?.kastes) {
      this.initForm(veikals.kastes);
    }
  }
  private _veikals: VeikalsWithTotals;

  @Output() valueChanges: Observable<VeikalsBox[]>;
  @Output() errors: Observable<null | ValidationErrors>;

  get valid(): boolean {
    return this.veikalsFormArray.valid;
  }

  fb: IFormBuilder;
  veikalsFormArray: IFormArray<VeikalsBox>;

  constructor(
    fb: FormBuilder,
    private prefService: KastesPreferencesService,
  ) {
    this.fb = fb;
    this.veikalsFormArray = this.fb.array<VeikalsBox>([], { validators: this.totalsValidator() });
    this.valueChanges = this.veikalsFormArray.valueChanges.pipe(
      filter(_ => this.veikalsFormArray.valid),
      map(_ => this.recalculateTotals(this.veikalsFormArray.getRawValue())),
    );
    this.errors = this.veikalsFormArray.valueChanges.pipe(
      map(_ => this.veikalsFormArray.valid ? null : this.veikalsFormArray.errors || {}),
    );
  }

  colors$ = this.prefService.preferences$.pipe(
    map(pref => pref.colors),
  );
  readonly colorNames = COLORS;

  ngOnInit(): void {
    this.valueChanges.subscribe(val => console.log(val));
    this.errors.subscribe(err => console.log(err));
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

  private colorTotals(veikals: VeikalsBox[]): { [key in Colors]: number } {
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
