import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MaterialsFilter, MaterialsService } from '../services/materials.service';
import { MaterialsFilterComponent } from './materials-filter/materials-filter.component';

@Component({
  selector: 'app-materials-list',
  templateUrl: './materials-list.component.html',
  styleUrls: ['./materials-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsListComponent implements OnInit, AfterViewInit {

  @ViewChild(MaterialsFilterComponent) private filter: MaterialsFilterComponent;

  displayedColumns = ['name', 'category',];

  materials$ = this.materialsService.materials$;

  constructor(
    private materialsService: MaterialsService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.filter) {
      this.filter?.clear();
    } else {
      this.materialsService.setFilter();
    }
  }

  onSetFilter(filter: MaterialsFilter) {
    this.materialsService.setFilter(filter);
  }

}
