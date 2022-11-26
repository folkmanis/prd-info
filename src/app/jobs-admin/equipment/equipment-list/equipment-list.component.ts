import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, debounceTime } from 'rxjs';
import { EquipmentPartial } from 'src/app/interfaces';
import { EquipmentFilter, EquipmentService } from '../services/equipment.service';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EquipmentListComponent {

  private filter = new BehaviorSubject<EquipmentFilter>({});

  equipment$: Observable<EquipmentPartial[]> = this.filter.pipe(
    debounceTime(300),
    switchMap(filter => this.equipmentService.getList(filter)),
  );


  displayedColumns = ['name'];

  constructor(
    private equipmentService: EquipmentService,
  ) { }


  onSetFilter(name: string) {
    if (typeof name === 'string' && name.trim().length > 0) {
      this.filter.next({ name: name.trim() });
    } else {
      this.filter.next({});
    }
  }

}
