import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { ProductionStagesService } from 'src/app/services/production-stages.service';
import { EquipmentService } from '../../equipment/services/equipment.service';

@Component({
    selector: 'app-production-stages-list',
    templateUrl: './production-stages-list.component.html',
    styleUrls: ['./production-stages-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SimpleListContainerComponent, RouterLink, RouterLinkActive, MatTableModule]
})
export class ProductionStagesListComponent {
  private productionStagesService = inject(ProductionStagesService);
  private equipmentService = inject(EquipmentService);

  stages$ = combineLatest([this.productionStagesService.productionStages$, this.equipmentService.getList()]).pipe(
    map(([prodS, equipments]) =>
      prodS.map((prod) => ({
        ...prod,
        equipment: prod.equipmentIds?.map((eqId) => equipments.find((eq) => eq._id === eqId)?.name || '???').join(', ') || '',
      })),
    ),
  );

  displayedColumns = ['name', 'equipment'];

  onSetNameFilter(name: string) {
    const filter = name?.length > 0 ? { name } : {};
    this.productionStagesService.setFilter(filter);
  }
}
