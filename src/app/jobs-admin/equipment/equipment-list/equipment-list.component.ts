import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BehaviorSubject, Observable, debounceTime, switchMap } from 'rxjs';
import { EquipmentPartial } from 'src/app/interfaces';
import { combineReload } from 'src/app/library/rxjs';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { EquipmentFilter, EquipmentService } from '../services/equipment.service';

@Component({
  selector: 'app-equipment-list',
  standalone: true,
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SimpleListContainerComponent,
    RouterLink,
    RouterLinkActive,
    MatTableModule,
  ]
})
export class EquipmentListComponent {

  private filter = new BehaviorSubject<EquipmentFilter>({});

  equipment$: Observable<EquipmentPartial[]> = combineReload(this.filter, this.equipmentService.reload$).pipe(
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
