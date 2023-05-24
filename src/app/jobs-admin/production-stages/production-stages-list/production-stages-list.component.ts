import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { EquipmentService } from '../../equipment/services/equipment.service';

import { ProductionStagesService } from 'src/app/services/production-stages.service';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-production-stages-list',
  standalone: true,
  templateUrl: './production-stages-list.component.html',
  styleUrls: ['./production-stages-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SimpleListContainerComponent,
    RouterLink,
    RouterLinkActive,
    MatTableModule,
  ]
})
export class ProductionStagesListComponent implements OnInit {

  stages$ = combineLatest([
    this.productionStagesService.productionStages$,
    this.equipmentService.getList(),
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
  }

  onSetNameFilter(name: string) {
    const filter = name?.length > 0 ? { name } : {};
    this.productionStagesService.setFilter(filter);
  }

}

