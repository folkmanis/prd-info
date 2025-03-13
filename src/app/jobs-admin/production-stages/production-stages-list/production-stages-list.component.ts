import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Equipment, ProductionStage } from 'src/app/interfaces';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { ProductionStagesService } from 'src/app/services/production-stages.service';
import { EquipmentService } from '../../equipment/services/equipment.service';

@Component({
  selector: 'app-production-stages-list',
  templateUrl: './production-stages-list.component.html',
  styleUrls: ['./production-stages-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SimpleListContainerComponent, RouterLink, RouterLinkActive, MatTableModule],
})
export class ProductionStagesListComponent {
  private productionStages = inject(ProductionStagesService).getProductionStagesResource();
  private equipments = inject(EquipmentService).getEquipmentResource();

  stages = computed(() => this.mapStages(this.productionStages.value() ?? [], this.equipments.value() ?? []));

  displayedColumns = ['name', 'equipment'];

  private mapStages(stages: ProductionStage[], equipments: Equipment[]) {
    return stages.map((stage) => ({
      ...stage,
      equipment: stage.equipmentIds?.map((eqId) => equipments.find((eq) => eq._id === eqId)?.name || '???').join(', ') || '',
    }));
  }

  onReload() {
    this.productionStages.reload();
  }
}
