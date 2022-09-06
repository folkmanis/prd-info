import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from 'prd-cdk';
import { map, merge, Observable, takeUntil } from 'rxjs';
import { Material, ProductUnit } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { getConfig } from 'src/app/services/config.provider';
import { MaterialsFormService } from '../services/materials-form.service';


@Component({
  selector: 'app-materials-edit',
  templateUrl: './materials-edit.component.html',
  styleUrls: ['./materials-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    MaterialsFormService,
    DestroyService,
  ]
})
export class MaterialsEditComponent implements OnInit, CanComponentDeactivate {

  units$: Observable<ProductUnit[]> = getConfig('jobs', 'productUnits').pipe(
    map(units => units.filter(unit => !unit.disabled)),
  );

  categories$ = getConfig('jobs', 'productCategories');

  form = this.formService.form;

  get changes() {
    return this.formService.changes;
  }

  constructor(
    private formService: MaterialsFormService,
    private router: Router,
    private route: ActivatedRoute,
    private destroy$: DestroyService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.route.data.pipe(
      map(data => data.value as Material),
      takeUntil(this.destroy$),
    ).subscribe(value => this.formService.setInitial(value));

    merge(this.form.valueChanges, this.form.statusChanges).pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => this.changeDetector.markForCheck());

  }

  onReset() {
    this.formService.reset();
  }

  onSave() {
    this.formService.save()
      .subscribe(c => this.router.navigate(['..', c._id], { relativeTo: this.route }));
  }

  canDeactivate(): boolean {
    return this.form.pristine;
  }


}
