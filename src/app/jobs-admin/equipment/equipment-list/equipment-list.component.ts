import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { EquipmentPartial } from 'src/app/interfaces';
import { EquipmentService } from '../services/equipment.service';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EquipmentListComponent implements OnInit {

  equipment$: Observable<EquipmentPartial[]> = this.equipmentService.equipment$;

  displayedColumns = ['name'];

  constructor(
    private equipmentService: EquipmentService,
  ) { }

  ngOnInit(): void {
  }

  onSetFilter(name: string) {
    if (typeof name === 'string' && name.trim().length > 0) {
      this.equipmentService.setFilter({ name });
    } else {
      this.equipmentService.setFilter(null);
    }
  }

}
