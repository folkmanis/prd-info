import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { IFormGroup } from '@rxweb/types';
import { MaterialsService } from '../services/materials.service';
import { MaterialsFormSource, MaterialPriceGroup } from '../services/materials-form-source';
import { Material, ProductUnit, SystemPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LayoutService } from 'src/app/services';
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
    this.updatePrice(new MaterialPriceGroup());
  }

  onEditPrice(idx: number) {
    this.updatePrice(
      new MaterialPriceGroup(this.pricesControl.at(idx).value),
      idx
    );
  }

  private updatePrice(control: MaterialPriceGroup, idx?: number) {
    const data: DialogData = {
      control,
      units: this.form.value.units,
    };
    this.dialogService.open<MaterialsPriceDialogComponent, DialogData, MaterialPriceGroup>(
      MaterialsPriceDialogComponent,
      { data }
    )
      .afterClosed()
      .pipe(
        filter(data => !!data),
      ).subscribe(data => this.formSource.updatePriceControl(data, idx));
  }

  onRemovePrice(idx: number) {
    this.formSource.deletePrice(idx);
  }


}
