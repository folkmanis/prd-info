import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, debounceTime, switchMap } from 'rxjs';
import { combineReload } from 'src/app/library/rxjs';
import { MaterialsFilter, MaterialsService } from '../services/materials.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MaterialsFilterComponent } from './materials-filter/materials-filter.component';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-materials-list',
  standalone: true,
  templateUrl: './materials-list.component.html',
  styleUrls: ['./materials-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MaterialsFilterComponent,
    SimpleListContainerComponent,
    MatCardModule,
    RouterLink,
    RouterLinkActive,
  ]
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
