import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as moment from 'moment';

import { ParserService } from 'src/app/library';

import { Job } from 'src/app/jobs/interfaces';
// import { CustomersService, ProductsService } from '../../services';


@Injectable()
export class JobImportService {

  constructor(
    private parser: ParserService,
    // private customersService: CustomersService,
  ) { }

  parseCsvFile(csvFile: File): Observable<Partial<Job>[]> {
    return this.readCsv(csvFile).pipe(
      map(csv => this.removeHeader(csv).content),
      map(this.convertToJob),
      tap(console.log),
    );
  }

  private readCsv(csvFile: File): Observable<any[]> {
    const fileReader = new FileReader();
    fileReader.readAsText(csvFile);

    return new Observable(
      (observer: Subscriber<any[]>): void => {

        fileReader.onload = (ev: ProgressEvent) => {
          const parsed = this.parser.parseCsv(fileReader.result.toString(), ',');

          observer.next(parsed);
          observer.complete();
        };

        fileReader.onerror = (error: ProgressEvent): void => {
          observer.error(error);
        };
      }
    );
  }

  private removeHeader(parsedCsv: any[][]): { header: any[]; content: any[][]; } {
    const [header, ...content] = parsedCsv;
    return { header, content };
  }

  private convertToJob(parsed: any[]): Partial<Job>[] {
    return parsed.map(row =>
      ({
        receivedDate: moment(row[0], 'YYYY.D.M').toDate(),
        jobId: +row[2],
        name: row[3],
      })
    );
  }

}
