import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { JobProductionStageMaterial } from 'src/app/interfaces';
import { MaterialsService } from 'src/app/jobs-admin/materials/services/materials.service';
import { MaterialGroup } from '../../services/products-form-source';

@Component({
  selector: 'app-production-stage-material',
  templateUrl: './production-stage-material.component.html',
  styleUrls: ['./production-stage-material.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionStageMaterialComponent implements OnInit {

  @Input() materialsControl: FormArray;

  materials$ = this.materialsService.materials$;
  jobProductionStageMaterials$: Observable<JobProductionStageMaterial[]>;

  displayedColumns = ['materialId', 'amount', 'fixedAmount', 'actions'];

  trackByFn = (idx: number) => this.materialsControl.controls[idx];


  constructor(
    private materialsService: MaterialsService,
  ) { }

  idControl(idx: number) {
    return this.materialsControl.controls[idx].get('materialId') as FormControl;
  }

  amountControl(idx: number) {
    return this.materialsControl.controls[idx].get('amount') as FormControl;
  }

  fixedAmountControl(idx: number) {
    return this.materialsControl.controls[idx].get('fixedAmount') as FormControl;
  }

  ngOnInit(): void {
    console.log(this.materialsControl.value);
    this.materialsService.setFilter(null);
    this.jobProductionStageMaterials$ = this.materialsControl.valueChanges.pipe(
      startWith(this.materialsControl.value)
    );
  }

  onNewMaterial() {
    this.materialsControl.push(new MaterialGroup());
    this.materialsControl.markAsDirty();
  }

  onDeleteMaterial(idx: number) {
    this.materialsControl.removeAt(idx);
    this.materialsControl.markAsDirty();
  }

}
