import { Component, computed, inject, signal, TrackByFunction } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MaterialList, ProductCategory } from 'src/app/interfaces';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { configuration } from 'src/app/services/config.provider';
import { MaterialsFilter } from '../schemas/materials.filter.schema';
import { MaterialsService } from '../services/materials.service';
import { MaterialsFilterComponent, MaterialsFilterModel } from './materials-filter/materials-filter.component';

@Component({
  selector: 'app-materials-list',
  templateUrl: './materials-list.component.html',
  styleUrls: ['./materials-list.component.scss'],
  imports: [
    MatTableModule,
    MaterialsFilterComponent,
    SimpleListContainerComponent,
    MatCardModule,
    RouterLink,
    RouterLinkActive,
  ],
})
export class MaterialsListComponent {
  protected userFilter = signal<MaterialsFilterModel>({
    name: '',
    categories: [],
  });
  #filter = computed<MaterialsFilter>(() => this.#modelToFilter(this.userFilter()));

  protected productCategories = configuration('jobs', 'productCategories');
  protected materials = inject(MaterialsService).getMaterialsResource(this.#filter);

  protected displayedColumns = ['name', 'category'];
  protected trackByFn: TrackByFunction<MaterialList> = (_, material) => material._id;

  onReload() {
    this.materials.reload();
  }

  protected categoryDescription(material: MaterialList, categories: ProductCategory[]): string {
    return categories.find((cat) => cat.category === material.category)?.description || '';
  }

  #modelToFilter({ name, categories }: MaterialsFilterModel): MaterialsFilter {
    return {
      name: name || undefined,
      categories: categories.length > 0 ? categories : undefined,
      inactive: true,
    };
  }
}
