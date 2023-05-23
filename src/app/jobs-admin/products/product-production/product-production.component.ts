import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Signal, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { ReactiveFormsModule, FormArray, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Product, JobProductionStage, ProductionStage, Material } from 'src/app/interfaces';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { isEqual, pickBy } from 'lodash-es';
import { AppClassTransformerService } from 'src/app/library';
import { ProductsService } from 'src/app/services';
import { ProductionMaterialComponent } from './production-material/production-material.component';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { SelectDirective } from 'src/app/library/directives/select.directive';


type JobProductionStageControlType = FormGroup<{
  [key in keyof JobProductionStage]: FormControl<JobProductionStage[key]>
}>;

@Component({
  selector: 'app-product-production',
  standalone: true,
  templateUrl: './product-production.component.html',
  styleUrls: ['./product-production.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SimpleFormContainerComponent,
    ReactiveFormsModule,
    MaterialLibraryModule,
    ProductionMaterialComponent,
    SelectDirective,
  ],
})
export class ProductProductionComponent implements CanComponentDeactivate {

  form = new FormArray<JobProductionStageControlType>([]);

  private update = signal<Product | null>(null);

  private routeData = toSignal(inject(ActivatedRoute).data);

  productionStages = computed<ProductionStage[]>(() => this.routeData().productionStages);
  materials = computed<Material[]>(() => this.routeData().materials);

  initialProduct = computed(() => this.update() || (this.routeData().product as Product));

  initialValue = computed(() => this.transformer.instanceToPlain(this.initialProduct().productionStages) as JobProductionStage[]);

  name: Signal<string> = computed(() => this.initialProduct().name);

  private formValue = toSignal(
    this.form.valueChanges as Observable<JobProductionStage[]>,
    { initialValue: this.form.value as JobProductionStage[] }
  );

  isChanged: Signal<boolean> = computed(() => !isEqual(this.formValue(), this.initialValue()));

  constructor(
    private transformer: AppClassTransformerService,
    private fb: FormBuilder,
    private productService: ProductsService,

  ) {
    effect(() => {
      const value = this.initialValue();
      this.setProductionStages(value);
    }, { allowSignalWrites: true });
  }

  onSave() {
    if (this.form.valid) {
      const update: Partial<Product> = {
        productionStages: this.formValue(),
        _id: this.initialProduct()._id,
      };
      this.productService.updateProduct(update)
        .subscribe(value => this.update.set(value));
    }
  }

  onReset(): void {
    this.setProductionStages(this.initialValue());
  }

  onDeleteStage(idx: number) {
    this.form.removeAt(idx);
  }

  onNewProductionStage(): void {
    this.form.push(this.stageControl());
  }

  canDeactivate(): boolean {
    return !this.isChanged();
  }

  private setProductionStages(stages?: JobProductionStage[]): void {

    stages = stages instanceof Array ? stages : [];

    if (stages.length === this.form.length) {
      this.form.setValue(stages);
    } else {
      this.form.clear({ emitEvent: false });
      stages.forEach(st => this.form.push(this.stageControl(st), { emitEvent: false }));
      this.form.updateValueAndValidity();
    }

  }

  private stageControl(stage: JobProductionStage = new JobProductionStage()): JobProductionStageControlType {
    return this.fb.nonNullable.group({
      productionStageId: [stage.productionStageId, [Validators.required]],
      amount: [stage.amount],
      fixedAmount: [stage.fixedAmount],
      materials: [stage.materials]
    });
  }


}
