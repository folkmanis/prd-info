import { Injectable } from '@angular/core';
import { Observable, Subscriber, zip, of } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { isEqual, flatten, isMatch, unionWith } from 'lodash';
import * as moment from 'moment';

import { ParserService } from 'src/app/library';

import { Customer, CustomerPartial, ProductPartial, ProductPrice, Job, JobProduct, Product } from 'src/app/interfaces';
import { PrdApiService } from 'src/app/services';
import {ProductsService, CustomersService } from 'src/app/services';

export interface ParsedObject {
  datums: Date;
  klients: string;
  numurs: number;
  nosaukums: string;
  preces: Preces;
  piezimes?: string;
  izrakstits: Date;
}
interface Preces {
  formuSkaits: number;
  formuIzmers: string;
  proof: string;
}
type ParsedCsv = [string, string, number, string, number, string, string, string | number, string];

export interface ProductCustomerPrice {
  name: string;
  prices: ProductPrice;
}

export interface ProductPriceImport {
  product: string;
  customerName: string;
  price?: number;
}


@Injectable()
export class JobImportService {
  private _header: string[];
  // Datums	Klients	Numurs	Nosaukums	Formu skaits	Formu izmērs	Proof skaits x formāts	Piezīmes	Izrakstīts

  constructor(
    private parser: ParserService,
    private customersService: CustomersService,
    private productService: ProductsService,
    private prdApi: PrdApiService,
  ) { }

  parseCsvFile(csvFile: File): Observable<ParsedObject[]> {
    return this.readCsv(csvFile).pipe(
      map(this.removeHeader),
      map(arr => arr
        .map(this.normalizeArray)
        .filter(this.filterEmpty)
      ),
    );
  }

  findMissingCustomers(parsedObjects: ParsedObject[]): Observable<string[]> {
    return zip(
      of(parsedObjects),
      this.customersService.getCustomerList()
    ).pipe(
      map(([parsed, customers]) =>
        parsed.reduce((acc, pars) => this.getMissingCustomer(pars.klients, customers, acc), new Set<string>())
      ),
      map(customerSet => [...customerSet]),
    );
  }

  findMissingProducts(parsedObjects: ParsedObject[]): Observable<string[]> {
    return this.productService.getAllProducts().pipe(
      map(products =>
        parsedObjects.reduce((acc, pars) => this.getMissingProduct(pars.preces, products, acc), new Set<string>())
      ),
      map(productSet => [...productSet]),
    );
  }

  convertToJobs(
    parsedObjects: ParsedObject[],
    newCustomers: Customer[]
  ): Observable<Partial<Job>[]> {
    return this.combineCustomers(newCustomers)
      .pipe(
        map(cust => parsedObjects
          .map(parsedObj => this.convertToJob(parsedObj, cust))
          .map(job => this.removeUndefined(job))
        ),
      );
  }
  // tslint:disable: semicolon
  private combineCustomers = (newCustomers: Customer[]): Observable<CustomerPartial[]> =>
    this.customersService.getCustomerList().pipe(
      map(existingCust => existingCust.concat(newCustomers))
    );

  getCustomerProducts(jobs: Partial<Job>[]): Observable<{ customerName: string; product: string; price?: number; }[]> {
    const prodSet = new CustomSet<{ customerName: string; product: string; }>(
      this.flattenJobs(jobs)
        .filter(job => !!job.products)
        .map(job => ({ customerName: job.customer, product: (job.products as JobProduct).name }))
    );
    return this.prdApi.products.customersProducts([...prodSet]).pipe(
      map(pricesDb => [...prodSet].map(prodImport => {
        const dbPrice = pricesDb.find(priceDb => isMatch(priceDb, prodImport));
        return dbPrice ? { ...prodImport, price: dbPrice.price } : prodImport;
      }))
    );
  }

  updateJobsPrices(jobs: Partial<Job>[], prices: ProductPriceImport[]): Partial<Job>[] {
    jobs.forEach(job => this.updateJobPrices(job, prices));
    return jobs;
  }

  private updateJobPrices(job: Partial<Job>, price: ProductPriceImport[]): void {
    if (!(job.products instanceof Array)) { return; }
    const jobProducts = job.products.map(prod => {
      if (prod.price) { return prod; }
      const pr = price.find(val => val.customerName === job.customer && val.product === prod.name);
      return { ...prod, price: pr.price };
    });
    job.products = jobProducts;
  }

  mergePrices(prices: ProductPriceImport[], updated: string[]): ProductPriceImport[] {
    const newPrices: ProductPriceImport[] = prices.filter(pr => !pr.price).map(
      (value, idx) => ({ ...value, price: +updated[idx] })
    );
    return unionWith(newPrices, prices, (np, op) => np.customerName === op.customerName && np.product === op.product);
  }

  flattenJobs(jobs: Partial<Job>[]): Partial<Job>[] {
    const flatJobs: Partial<Job>[] = [];
    for (const job of jobs) {
      if (!(job.products instanceof Array)) {
        flatJobs.push(job);
      } else if (job.products.length === 0) {
        delete job.products;
        flatJobs.push(job);
      } else {
        job.products.forEach(prod => flatJobs.push({
          ...job, products: prod
        }));
      }
    }
    return flatJobs;
  }

  uploadJobs(data: {
    customers: Partial<Customer>[],
    products: Partial<Product>[],
    prices: ProductPriceImport[],
    jobs: Partial<Job>[],
  }): Observable<number> {
    return this.prdApi.jobs.importJobs(data);
  }

  private readCsv<T extends (string | number)[] = (string | number)[]>(csvFile: File): Observable<T[]> {
    const fileReader = new FileReader();
    fileReader.readAsText(csvFile);

    return new Observable(
      (observer: Subscriber<T[]>): void => {

        fileReader.onload = (ev: ProgressEvent) => {
          const parsed = this.parser.parseCsv(fileReader.result.toString(), ',') as T[];

          observer.next(parsed);
          observer.complete();
        };

        fileReader.onerror = (error: ProgressEvent): void => {
          observer.error(error);
        };
      }
    );
  }

  private removeHeader(parsedCsv: (string[] | ParsedCsv)[]): ParsedCsv[] {
    const [header, ...content] = parsedCsv;
    this._header = header as string[];
    return content as ParsedCsv[];
  }

  private normalizeArray(row: ParsedCsv): ParsedObject {
    return {
      datums: moment(row[0], 'YYYY.D.M').toDate(),
      klients: row[1],
      numurs: +row[2],
      nosaukums: row[3],
      preces: {
        formuSkaits: row[4],
        formuIzmers: row[5],
        proof: row[6],
      },
      piezimes: row[7] === 0 ? undefined : row[7].toString(),
      izrakstits: row[8] ? moment(row[8], 'YYYY.D.M').toDate() : undefined,
    };
  }

  private filterEmpty(parsed: ParsedObject): boolean {
    return parsed.nosaukums.length > 0;
  }

  private convertToJob(parsed: ParsedObject, customers: CustomerPartial[]): Partial<Job> {
    return {
      jobId: parsed.numurs,
      customer: this.getCustomer(parsed.klients, customers),
      name: parsed.nosaukums,
      receivedDate: parsed.datums,
      comment: parsed.piezimes,
      invoiceId: parsed.izrakstits ? '00000' : undefined,
      products: this.makeProductArray(parsed.preces),
    };
  }

  private getCustomer = (code: string, customers: CustomerPartial[]): string =>
    // tslint:disable-next-line: semicolon
    customers.find(cust => cust.code === code).CustomerName;

  private getMissingCustomer(code: string, customers: CustomerPartial[], missing: Set<string>): Set<string> {
    const customer = customers.find(cust => cust.code === code);
    if (!customer) {
      missing.add(code);
    }
    return missing;
  }

  private getMissingProduct(prece: Preces, products: ProductPartial[], missing: Set<string>): Set<string> {
    if (prece.formuIzmers) {
      const formuIzmers = this.plateName(prece.formuIzmers);
      const productName: ProductPartial | undefined = products.find(pr => pr.name === formuIzmers);
      if (!productName) { missing.add(formuIzmers); }
    }
    if (prece.proof.length) {
      this.parseProof(prece.proof).forEach(proof => {
        if (!products.find(pr => pr.name === proof.name)) { missing.add(proof.name); }
      });
    }
    return missing;
  }

  private makeProductArray(prece: Preces): JobProduct[] {
    const jobProducts: JobProduct[] = [];
    if (prece.formuIzmers) {
      jobProducts.push({
        name: this.plateName(prece.formuIzmers),
        count: prece.formuSkaits,
        price: 0,
      });
    }
    if (prece.proof.length) {
      jobProducts.push(...this.parseProof(prece.proof));
    }
    return jobProducts;
  }

  private plateName = (name: string): string => `Plates ${name}`;
  private proofName = (name: string): string => `Paraugnovilkums ${name}`;

  private parseProof(expr: string): JobProduct[] {
    const items: JobProduct[] = [];
    expr.trim().split(/[.,]/)
      .forEach(itm => {
        const rec = itm.trim().split('x');
        if (rec.length > 1) {
          items.push({
            name: this.proofName(rec[1]).trim(),
            count: +rec[0],
            price: 0,
            comment: ''
          });
          return;
        }
        if (/EUR/.test(rec[0].toUpperCase())) {
          items.push({
            name: 'Paraugnovilkums',
            count: 1,
            price: +rec[0].search(/\d+/),
            comment: ''
          });
          return;
        }
        if (/GAB/.test(rec[0].toUpperCase())) {
          items.push({
            name: 'Paraugnovilkums',
            count: +rec[0].search(/\d+/),
            price: 0,
            comment: ''
          });
          return;
        }
        items.push({
          name: this.proofName(rec[0]).trim(),
          count: 1,
          price: 0,
          comment: '',
        });

      });
    return items;
  }

  private removeUndefined(obj: any): any {
    if (obj instanceof Object) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === undefined) {
          delete obj[key];
        }
      }
    }
    return obj;
  }

}

class CustomSet<T> {
  private readonly content: T[] = [];
  [Symbol.iterator] = this.values;

  constructor(arr: Array<T>) {
    arr.forEach(value => this.add(value));
  }

  add(val: T): CustomSet<T> {
    if (!this.has(val)) { this.content.push(val); }
    return this;
  }

  has = (val: T): boolean => this.content.some(cont => isEqual(cont, val));

  values(): IterableIterator<T> { return this.content.values(); }

}
