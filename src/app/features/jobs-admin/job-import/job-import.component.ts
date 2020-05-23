import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { Job, JobsSettings, StoreState } from 'src/app/interfaces';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { getModulePreferences } from 'src/app/store/selectors';
import { ProductPriceImport } from '../services';
import { JobImportService, ParsedObject } from '../services/job-import.service';

@Component({
  selector: 'app-job-import',
  templateUrl: './job-import.component.html',
  styleUrls: ['./job-import.component.css'],
  providers: [JobImportService],
})
export class JobImportComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private service: JobImportService,
    private fb: FormBuilder,
    private dialog: ConfirmationDialogService,
    private store: Store<StoreState>,
  ) { }

  categories$ = this.store.select(getModulePreferences, { module: 'jobs' }).pipe(
    map((jobSett: JobsSettings) => jobSett.productCategories),
  );

  parsedJobs: ParsedObject[];
  missingCustomers: string[] = [];
  missingProducts: string[] = [];
  prices: ProductPriceImport[] = [];
  missingPrices: ProductPriceImport[] = [];
  jobs: Partial<Job>[] = [];
  jobsToUpload: Partial<Job>[] = [];

  customersForm = new FormArray([]);
  productsForm = new FormArray([]);
  pricesForm = new FormArray([]);

  private readonly _subs = new Subscription();

  ngOnInit(): void {
    // this.customersForm.setErrors({ required: 'Required' });
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  onFileDrop(fileList: FileList): void {
    const file = fileList.item(0);
    if (file.name.endsWith('.csv') && fileList.length === 1) {
      this.service.parseCsvFile(file).pipe(
        tap(parsed => this.parsedJobs = parsed)
      ).subscribe();
    }
  }

  onCsvUploaded(): void {
    this.service.findMissingCustomers(this.parsedJobs).pipe(
      tap(missing => this.missingCustomers = missing),
    ).subscribe();
  }

  onCustomersComplete(): void {
    this.service.findMissingProducts(this.parsedJobs).pipe(
      tap(missing => this.createProductsForm(missing)),
    ).subscribe(missing => this.missingProducts = missing);
  }

  onProductsComplete(): void {
    this.service.convertToJobs(this.parsedJobs, this.customersForm.value).pipe(
      tap(jobs => this.jobs = jobs),
      switchMap(jobs => this.service.getCustomerProducts(jobs)),
      tap(products => this.prices = products),
      tap(products => this.missingPrices = products.filter(pr => !pr.price)),
    )
      .subscribe();
  }

  onPricesComplete(): void {
    // Papildina cenu masīvu (trūkstošās cenas aizstāj ar vērtībām no formas)
    this.prices = this.service.mergePrices(this.prices, this.pricesForm.value);
    this.jobsToUpload = this.service.updateJobsPrices(this.jobs, this.prices);
  }

  onUploadJobs(): void {
    this.dialog.confirm('Vai augšuplādēt jaunos ierakstus?').pipe(
      filter(resp => resp),
      switchMap(() =>
        this.service.uploadJobs({
          customers: this.customersForm.value,
          products: this.productsForm.value,
          prices: this.prices,
          jobs: this.jobsToUpload,
        })
      ),
      tap(resp => console.log(resp)),
      tap(() => this.router.navigate(['/jobs'])),
    ).subscribe();
  }

  private createProductsForm(productsStr: string[]) {
    this.productsForm.clear();
    productsStr.forEach(prod => this.productsForm.push(
      this.fb.group({
        name: [prod],
        category: [undefined, Validators.required],
        description: [undefined],
      })
    ));
  }



  /** Testam */
  savePersistence(): void {
    localStorage.setItem('parsedJobs', JSON.stringify(this.parsedJobs));
    localStorage.setItem('missingCustomers', JSON.stringify(this.missingCustomers));
    localStorage.setItem('customersForm', JSON.stringify(this.customersForm.value));
    localStorage.setItem('productsForm', JSON.stringify(this.productsForm.value));
    localStorage.setItem('pricesForm', JSON.stringify(this.pricesForm.value));
  }

  restoreParsedJobs(): void {
    this.parsedJobs = JSON.parse(localStorage.getItem('parsedJobs'));
  }
  restoreCustomers(): void {
    this.customersForm.setValue(JSON.parse(localStorage.getItem('customersForm')));
  }
  restoreProducts(): void {
    this.productsForm.setValue(JSON.parse(localStorage.getItem('productsForm')));
  }
  restorePrices(): void {
    this.pricesForm.setValue(JSON.parse(localStorage.getItem('pricesForm')));
  }

}
