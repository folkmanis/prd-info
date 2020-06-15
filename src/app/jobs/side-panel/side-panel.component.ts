import { Component, OnInit } from '@angular/core';
import { Observable, from, EMPTY } from 'rxjs';
import { switchMap, tap, map, concatAll, concatMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { JobEditDialogService } from '../services/job-edit-dialog.service';
import { CustomersService } from 'src/app/services';
import { CustomerInputDialogComponent } from './customer-input-dialog/customer-input-dialog.component';
import { JobService } from '../services/job.service';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css']
})
export class SidePanelComponent implements OnInit {

  constructor(
    private jobDialog: JobEditDialogService,
    private dialog: MatDialog,
    private customersService: CustomersService,
    private jobService: JobService,
  ) { }

  ngOnInit(): void {
  }

  onFileDrop(event: FileList | any) {
    if (event instanceof FileList && event.length > 0) {
      const names: string[] = [];
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < event.length; i++) {
        names.push(event[i].name.replace(/\.[^/.]+$/, ''));
      }
      if (names.length === 1) {
        this.jobDialog.newJob({ name: names[0] }).subscribe();
      } else {
        this.customersService.customers$.pipe(
          switchMap(cust => this.dialog.open(CustomerInputDialogComponent, { data: { customers: cust } }).afterClosed()),
          map((cust: string) => cust ? names.map(name => ({ customer: cust, name })) : EMPTY),
          map(jobs => from(jobs)
            .pipe(
              concatMap(job => this.jobService.newJob(job))
            ),
          ),
          concatAll(),
        ).subscribe();
      }

    }
  }

}
