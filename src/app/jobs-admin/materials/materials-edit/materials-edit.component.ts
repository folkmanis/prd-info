import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { IFormGroup } from '@rxweb/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Material, ProductUnit, SystemPreferences } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { CONFIG } from 'src/app/services/config.provider';
import { MaterialsFormSource } from '../services/materials-form-source';

@Component({
  selector: 'app-materials-edit',
  templateUrl: './materials-edit.component.html',
  styleUrls: ['./materials-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: SimpleFormSource, useClass: MaterialsFormSource }
  ]
})
export class MaterialsEditComponent implements OnInit, CanComponentDeactivate {

  units$: Observable<ProductUnit[]> = this.config$.pipe(
    map(conf => conf.jobs.productUnits),
    map(units => units.filter(unit => !unit.disabled)),
  );

  categories$ = this.config$.pipe(
    map(conf => conf.jobs.productCategories),
  );

  get form(): IFormGroup<Material> {
    return this.formSource.form;
  }

  constructor(
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private formSource: SimpleFormSource<Material>,
  ) { }

  ngOnInit(): void {
  }

  onDataChange(material: Material) {
    this.formSource.initValue(material);
  }

  canDeactivate(): boolean {
    return this.form.pristine;
  }


}
