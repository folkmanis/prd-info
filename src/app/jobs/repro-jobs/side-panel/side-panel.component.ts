import { ChangeDetectionStrategy, Component, Output, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { JobQueryFilter } from '../../interfaces';


@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidePanelComponent implements OnDestroy {

  @Output() jobFilter = new Subject<JobQueryFilter>();

  fileDrop = new Subject<FileList | any>();

  @Output() file: Observable<FileList> = this.fileDrop.pipe(
    filter(drop => drop instanceof FileList && drop.length > 0),
  );

  constructor(
  ) { }

  ngOnDestroy() {
    this.fileDrop.complete();
  }

}
