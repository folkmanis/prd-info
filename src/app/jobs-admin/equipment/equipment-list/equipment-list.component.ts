import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BehaviorSubject, Observable, debounceTime, switchMap } from 'rxjs';
import { EquipmentPartial } from 'src/app/interfaces';
import { combineReload } from 'src/app/library/rxjs';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { EquipmentFilter, EquipmentService } from '../services/equipment.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-equipment-list',
  standalone: true,
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SimpleListContainerComponent,
    RouterLink,
    RouterLinkActive,
    MatTableModule,
  ]
})
export class EquipmentListComponent {

  private equipmentService = inject(EquipmentService);

  private filter = computed(() => {
    const name = this.name()?.trim() || '';
    return name.length > 0 ? { name } : {};
  });

  private equipment$: Observable<EquipmentPartial[]> = combineReload(toObservable(this.filter), this.equipmentService.reload$).pipe(
    debounceTime(300),
    switchMap(filter => this.equipmentService.getList(filter)),
  );

  name = signal('');

  equipment = toSignal(this.equipment$, { initialValue: [] });

  displayedColumns = ['name'];


}
