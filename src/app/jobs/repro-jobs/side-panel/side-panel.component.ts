import { ChangeDetectionStrategy, Component, Input, OnDestroy, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { JobPartial } from '../../interfaces';


@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidePanelComponent implements OnDestroy {

  @Input() jobs: JobPartial[];

  fileDrop = new Subject<FileList | any>();

  @Output() file: Observable<FileList> = this.fileDrop.pipe(
    filter(drop => drop instanceof FileList && drop.length > 0),
  );

  ngOnDestroy() {
    this.fileDrop.complete();
  }

}
