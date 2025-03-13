import { ChangeDetectionStrategy, Component, computed, inject, model, TrackByFunction } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { MaterialsFilter, MaterialsService, MaterialWithDescription } from '../services/materials.service';
import { MaterialsFilterComponent } from './materials-filter/materials-filter.component';
import { Material } from 'src/app/interfaces';
import { configuration } from 'src/app/services/config.provider';

@Component({
  selector: 'app-materials-list',
  templateUrl: './materials-list.component.html',
  styleUrls: ['./materials-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, MaterialsFilterComponent, SimpleListContainerComponent, MatCardModule, RouterLink, RouterLinkActive],
})
export class MaterialsListComponent {
  private productCategories = configuration('jobs', 'productCategories');

  filter = model<MaterialsFilter>({});

  private materials = inject(MaterialsService).getMaterialsResource(this.filter);

  materialsWithDescriptions = computed(() => this.appendDescriptions(this.materials.value()));

  trackByFn: TrackByFunction<MaterialWithDescription> = (_, material) => material._id;

  displayedColumns = ['name', 'category'];

  onReload() {
    this.materials.reload();
  }

  private appendDescriptions(materials: Material[]): MaterialWithDescription[] {
    const categories = this.productCategories();
    return materials.map((material) => ({
      ...material,
      catDes: categories.find((cat) => cat.category === material.category)?.description || '',
    }));
  }
}
