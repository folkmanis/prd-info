import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, debounceTime, switchMap } from 'rxjs';
import { combineReload } from 'src/app/library/rxjs';
import { MaterialsFilter, MaterialsService } from '../services/materials.service';


@Component({
  selector: 'app-materials-list',
  templateUrl: './materials-list.component.html',
  styleUrls: ['./materials-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsListComponent {

  private filter$ = new BehaviorSubject<MaterialsFilter>({});

  materials$ = combineReload(this.filter$, this.materialsService.reload$).pipe(
    debounceTime(300),
    switchMap(filter => this.materialsService.materialsWithDescriptions(filter)),
  );

  displayedColumns = ['name', 'category',];

  constructor(
    private materialsService: MaterialsService,
  ) { }


  onSetFilter(filter: MaterialsFilter) {
    this.filter$.next(filter);
  }

}
