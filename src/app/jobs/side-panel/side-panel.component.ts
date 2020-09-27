import { Component, OnInit } from '@angular/core';
import { Observable, from, EMPTY } from 'rxjs';
import { switchMap, tap, map, concatAll, concatMap, mergeMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { JobEditDialogService } from '../job-edit';
import { CustomersService } from 'src/app/services';
import { CustomerInputDialogComponent } from './customer-input-dialog/customer-input-dialog.component';
import { JobService } from 'src/app/services/job.service';

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
          mergeMap(
            (cust: string | undefined) => cust ? this.jobService.newJobs(names.map(name => ({ customer: cust, name }))) : EMPTY
          ),
        ).subscribe();
      }
    }
  }

}
