import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
  name = signal('');

  filter = computed(() => {
    const name = this.name()?.trim() || '';
    return name.length > 0 ? { name } : {};
  });

  equipment = inject(EquipmentService).getEquipmentResource(this.filter);

  displayedColumns = ['name'];

  onReload() {
    this.equipment.reload();
  }
}
