import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ClassTransformer } from 'class-transformer';
import { JobsProductionFilter, JobsProductionQuery } from '../interfaces';
import { pickNotNull } from '../services/jobs-api.service';
import { FilterForm, FormData } from './filter/filter-form';
import { ProductsTableComponent } from './products-table/products-table.component';

export const REPRO_DEFAULTS: FormData = {
  jobStatus: [10, 20],
  category: ['repro'],
  timeInterval: {
    start: null,
    end: null,
  }
};


@Component({
  selector: 'app-products-production',
  templateUrl: './products-production.component.html',
  styleUrls: ['./products-production.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FilterForm],
})
export class ProductsProductionComponent implements AfterViewInit {

  @ViewChild(ProductsTableComponent)
  private table: ProductsTableComponent;

  filter: JobsProductionFilter;

  constructor(
    private transformer: ClassTransformer,
    private router: Router,
    private form: FilterForm,
  ) { }

  ngAfterViewInit(): void {
    this.filter = this.form.filterValue;
  }

  onFilter(value: JobsProductionFilter) {
    this.filter = value;
    this.navigate();
  }

  navigate() {
    const queryParams: JobsProductionQuery = this.transformer.instanceToPlain(this.filter) as JobsProductionQuery;
    queryParams.sort = this.table.activeSortStr;
    queryParams.start = 0;
    queryParams.limit = 100;

    this.router.navigate([], { queryParams });

  }

  setRepro() {
    this.form.setValue(REPRO_DEFAULTS);
  }


}
