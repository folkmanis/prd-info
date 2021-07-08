import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { IFormGroup } from '@rxweb/types';
import { MaterialsService } from '../services/materials.service';
import { MaterialsFormSource } from '../services/materials-form-source';
import { Material, ProductUnit, SystemPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LayoutService } from 'src/app/layout/layout.service';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { MatDialog } from '@angular/material/dialog';
import { MaterialsPriceDialogComponent, DialogData } from './materials-price-dialog/materials-price-dialog.component';

@Component({
  selector: 'app-materials-edit',
  templateUrl: './materials-edit.component.html',
  styleUrls: ['./materials-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsEditComponent implements OnInit, CanComponentDeactivate {

  formSource: MaterialsFormSource = new MaterialsFormSource(this.fb, this.materialsService);

  units$: Observable<ProductUnit[]> = this.config$.pipe(
    map(conf => conf.jobs.productUnits),
    map(units => units.filter(unit => !unit.disabled)),
  );

  categories$ = this.config$.pipe(
    map(conf => conf.jobs.productCategories),
  );

  large$ = this.layout.isLarge$;

  get form(): IFormGroup<Material> {
    return this.formSource.form;
  }

  get pricesControl(): FormArray {
    return this.form.get('prices') as unknown as FormArray;
  }

  constructor(
    private materialsService: MaterialsService,
    private fb: FormBuilder,
    private layout: LayoutService,
    private dialogService: MatDialog,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
  ) { }

  ngOnInit(): void {
  }

  onDataChange(material: Material) {
    this.formSource.initValue(material);
  }

  canDeactivate(): boolean {
    return this.form.pristine;
  }

  onAddPrice() {
    this.onEditPrice();
  }

  onEditPrice(idx?: number) {
    const val = idx !== undefined ? this.pricesControl.at(idx).value : undefined;
    const data: DialogData = {
      control: this.formSource.newMaterialPriceGroup(val),
      units: this.form.value.units,
    };
    this.dialogService.open<MaterialsPriceDialogComponent, DialogData, FormGroup>(
      MaterialsPriceDialogComponent,
      { data }
    )
      .afterClosed()
      .pipe(
        filter(data => !!data),
      ).subscribe(data => {
        idx !== undefined ? this.pricesControl.setControl(idx, data) : this.pricesControl.push(data);
        this.pricesControl.markAsDirty();
      });
  }

  onRemovePrice(idx: number) {
    this.formSource.deletePrice(idx);
  }

}
