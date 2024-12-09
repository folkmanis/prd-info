import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { EquipmentService } from '../services/equipment.service';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SimpleListContainerComponent, RouterLink, RouterLinkActive, MatTableModule],
})
export class EquipmentListComponent {
  private equipmentService = inject(EquipmentService);

  name = signal('');

  equipment = this.equipmentService.equipment;

  displayedColumns = ['name'];

  constructor() {
    effect(() => {
      const name = this.name()?.trim() || '';
      const filter = name.length > 0 ? { name } : {};
      this.equipmentService.filter.set(filter);
    });
  }
}
