import { Inject } from '@angular/core';
import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { Material, ProductCategory, SystemPreferences } from 'src/app/interfaces';
import { LayoutService } from 'src/app/layout/layout.service';
import { CONFIG } from 'src/app/services/config.provider';
import { MaterialsService } from '../services/materials.service';

@Component({
  selector: 'app-materials-list',
  templateUrl: './materials-list.component.html',
  styleUrls: ['./materials-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsListComponent implements OnInit, AfterViewInit {

  displayedColumns = ['name', 'category',];
  large$ = this.layout.isLarge$;

  private categories$ = this.config$.pipe(
    pluck('jobs', 'productCategories'),
  );
  materials$ = combineLatest([this.materialsService.materials$, this.categories$]).pipe(
    map(this.addCategoriesDescription)
  );

  constructor(
    private materialsService: MaterialsService,
    private layout: LayoutService,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.materialsService.reload();
  }

  private addCategoriesDescription([materials, categories]: [Material[], ProductCategory[]]): (Material & { catDes: string; })[] {
    return materials.map(
      material => ({
        ...material,
        catDes: categories.find(cat => cat.category === material.category)?.description || ''
      })
    );
  }

}
