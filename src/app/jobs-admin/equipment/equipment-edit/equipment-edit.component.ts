import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Equipment } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { EquipmentFormService } from '../services/equipment-form.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DestroyService } from 'prd-cdk';
import { debounceTime, map, merge, takeUntil } from 'rxjs';



@Component({
  selector: 'app-equipment-edit',
  templateUrl: './equipment-edit.component.html',
  styleUrls: ['./equipment-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    EquipmentFormService,
    DestroyService,
  ]
})
export class EquipmentEditComponent implements OnInit, CanComponentDeactivate {


  form = this.formService.form;

  get changes() {
    return this.formService.changes;
  }

  constructor(
    private formService: EquipmentFormService,
    private destroy$: DestroyService,
    private chDetector: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.route.data.pipe(
      map(data => data.value as Equipment),
      takeUntil(this.destroy$),
    ).subscribe(equipment => this.formService.setValue(equipment));

    merge(this.form.valueChanges, this.form.statusChanges).pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => this.chDetector.markForCheck());

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
