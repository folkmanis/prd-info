import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from 'prd-cdk';
import { map, merge, takeUntil } from 'rxjs';
import { ProductionStage } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { EquipmentService } from '../../equipment/services/equipment.service';
import { ProductionStagesFormService } from '../services/production-stages-form.service';


@Component({
  selector: 'app-production-stages-edit',
  templateUrl: './production-stages-edit.component.html',
  styleUrls: ['./production-stages-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductionStagesFormService, DestroyService]
})
export class ProductionStagesEditComponent implements OnInit, CanComponentDeactivate {

  equipment$ = this.equipmentService.equipment$;

  form = this.formService.form;

  get changes(): Partial<ProductionStage> | null {
    return this.formService.changes;
  }


  constructor(
    private equipmentService: EquipmentService,
    private formService: ProductionStagesFormService,
    private route: ActivatedRoute,
    private router: Router,
    private destroy$: DestroyService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  onReset(): void {
    this.formService.reset();
  }

  onSave(): void {
    this.formService.save()
      .subscribe(c => this.router.navigate(['..', c._id], { relativeTo: this.route }));
  }


  ngOnInit(): void {
    this.route.data.pipe(
      map(data => data.value as ProductionStage),
      takeUntil(this.destroy$),
    ).subscribe(customer => this.formService.setInitial(customer));

    merge(this.form.valueChanges, this.form.statusChanges).pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => this.changeDetector.markForCheck());

    this.equipmentService.setFilter(null);
  }

  canDeactivate(): boolean {
    return this.form.pristine || !this.formService.changes;
  }

}
