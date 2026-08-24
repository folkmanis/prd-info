import { Component, computed, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { EquipmentService } from '../services/equipment.service';
import { EquipmentFilter } from '../services/equipment-filter.schema';
import { nonNullResource, withPreviousValue } from 'src/app/library/signals';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss'],
  imports: [SimpleListContainerComponent, RouterLink, RouterLinkActive, MatTableModule],
})
export class EquipmentListComponent {
  name = signal('');

  protected filter = computed<EquipmentFilter>(() => ({ name: this.name().trim(), disabled: true }));

  #equipment = inject(EquipmentService).getEquipmentResource(this.filter);
  protected equipmentNonNull = nonNullResource(withPreviousValue(this.#equipment), []);

  protected displayedColumns = ['name'];

  onReload() {
    this.#equipment.reload();
  }
}
