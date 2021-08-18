import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { log } from 'prd-cdk';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { EquipmentService } from '../../equipment/services/equipment.service';

import { ProductionStagesService } from '../services/production-stages.service';

@Component({
  selector: 'app-production-stages-list',
  templateUrl: './production-stages-list.component.html',
  styleUrls: ['./production-stages-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionStagesListComponent implements OnInit {

  stages$ = combineLatest([
    this.productionStagesService.productionStages$,
    this.equipmentService.equipment$,
  ]).pipe(
    map(([prodS, equipments]) =>
      prodS.map(prod => ({
        ...prod,
        equipment: prod.equipmentIds?.map(eqId => equipments.find(eq => eq._id === eqId)?.name || '???').join(', ') || ''
      }))
    ),
  );

  displayedColumns = ['name', 'equipment'];

  constructor(
    private productionStagesService: ProductionStagesService,
    private equipmentService: EquipmentService,
  ) { }

  ngOnInit(): void {
    this.equipmentService.setFilter(null);
  }

  onSetNameFilter(name: string) {
    const filter = name?.length > 0 ? { name } : null;
    this.productionStagesService.setFilter(filter);
  }

}

