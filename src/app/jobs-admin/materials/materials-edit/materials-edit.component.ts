import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IFormGroup } from '@rxweb/types';
import { MaterialsService } from '../services/materials.service';
import { MaterialsFormSource } from '../services/materials-form-source';
import { Material, ProductUnit, SystemPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LayoutService } from 'src/app/layout/layout.service';

@Component({
  selector: 'app-materials-edit',
  templateUrl: './materials-edit.component.html',
  styleUrls: ['./materials-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsEditComponent implements OnInit {

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

  constructor(
    private materialsService: MaterialsService,
    private fb: FormBuilder,
    private layout: LayoutService,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
  ) { }

  ngOnInit(): void {
  }

  onDataChange(material: Material) {
    this.formSource.initValue(material);
  }

}
