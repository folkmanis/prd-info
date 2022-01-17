import { Inject } from '@angular/core';
import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ViewChild } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { Material, ProductCategory, SystemPreferences } from 'src/app/interfaces';
import { LayoutService } from 'src/app/services';
import { CONFIG } from 'src/app/services/config.provider';
import { MaterialsService, MaterialsFilter } from '../services/materials.service';
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
  large$ = this.layout.isLarge$;

  materials$ = this.materialsService.materials$;

  constructor(
    private materialsService: MaterialsService,
    private layout: LayoutService,
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
