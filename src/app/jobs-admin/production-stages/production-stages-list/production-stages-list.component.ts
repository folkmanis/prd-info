import { Component, computed, inject, TrackByFunction } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Equipment, ProductionStage, ProductionStageList } from 'src/app/interfaces';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { ProductionStagesService } from 'src/app/services/production-stages.service';
import { EquipmentService } from '../../equipment/services/equipment.service';
import { nonNullResource, withPreviousValue } from 'src/app/library/signals';

@Component({
  selector: 'app-production-stages-list',
  templateUrl: './production-stages-list.component.html',
  styleUrls: ['./production-stages-list.component.scss'],
  imports: [SimpleListContainerComponent, RouterLink, RouterLinkActive, MatTableModule],
})
export class ProductionStagesListComponent {
  #productionStages = inject(ProductionStagesService).getProductionStagesResource();
  protected stages = nonNullResource(withPreviousValue(this.#productionStages), []);

  protected equipments = inject(EquipmentService).getEquipmentResource({ disabled: true });

  protected displayedColumns = ['name', 'equipment'];

  protected mapStage(equipmentIds: string[], equipments: Equipment[]): string {
    return equipmentIds.map((eqId) => equipments.find((eq) => eq._id === eqId)?.name || '???').join(', ') || '';
  }

  protected trackByFn: TrackByFunction<ProductionStageList> = (_, stage) => stage._id;

  onReload() {
    this.#productionStages.reload();
  }
}
