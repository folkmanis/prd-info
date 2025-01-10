import { ChangeDetectionStrategy, Component, computed, inject, model, TrackByFunction } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { MaterialsFilter, MaterialsService, MaterialWithDescription } from '../services/materials.service';
import { MaterialsFilterComponent } from './materials-filter/materials-filter.component';

@Component({
  selector: 'app-materials-list',
  templateUrl: './materials-list.component.html',
  styleUrls: ['./materials-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MaterialsFilterComponent, SimpleListContainerComponent, MatCardModule, RouterLink, RouterLinkActive],
})
export class MaterialsListComponent {
  #materials = inject(MaterialsService).materialsWithDescriptions;

  filter = model<MaterialsFilter>({});

  materialsFiltered = computed(() => {
    const { name, categories } = this.filter() ?? {};
    return this.#materials().filter(
      (material) => (!name || material.name.toUpperCase().includes(name.toUpperCase())) && (!categories || categories.length === 0 || categories.includes(material.category)),
    );
  });

  trackByFn: TrackByFunction<MaterialWithDescription> = (_, material) => material._id;

  displayedColumns = ['name', 'category'];
}
