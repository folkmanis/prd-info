import { Component, inject, TrackByFunction } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Equipment, ProductionStageList } from 'src/app/interfaces';
import { ProductionStagesService } from 'src/app/jobs-admin/production-stages/services/production-stages.service';
import { nonNullResource, withPreviousValue } from 'src/app/library/signals';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { EquipmentService } from '../../equipment/services/equipment.service';

@Component({
  selector: 'app-production-stages-list',
  templateUrl: './production-stages-list.component.html',
  styleUrls: ['./production-stages-list.component.scss'],
  imports: [SimpleListContainerComponent, RouterLink, RouterLinkActive, MatTableModule],
})
export class ProductionStagesListComponent {
  #productionStages = inject(ProductionStagesService).getProductionStagesResource({ disabled: true });
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
