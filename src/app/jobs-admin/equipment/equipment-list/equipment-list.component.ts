import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, debounceTime, switchMap } from 'rxjs';
import { EquipmentPartial } from 'src/app/interfaces';
import { combineReload } from 'src/app/library/rxjs';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { EquipmentService } from '../services/equipment.service';

@Component({
    selector: 'app-equipment-list',
    templateUrl: './equipment-list.component.html',
    styleUrls: ['./equipment-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SimpleListContainerComponent, RouterLink, RouterLinkActive, MatTableModule]
})
export class EquipmentListComponent {
  private equipmentService = inject(EquipmentService);

  private filter = computed(() => {
    const name = this.name()?.trim() || '';
    return name.length > 0 ? { name } : {};
  });

  private equipment$: Observable<EquipmentPartial[]> = combineReload(toObservable(this.filter), this.equipmentService.reload$).pipe(
    debounceTime(300),
    switchMap((filter) => this.equipmentService.getList(filter)),
  );

  name = signal('');

  equipment = toSignal(this.equipment$, { initialValue: [] });

  displayedColumns = ['name'];
}
