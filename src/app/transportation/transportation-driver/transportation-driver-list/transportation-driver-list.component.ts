import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SimpleListContainerComponent } from 'src/app/library/simple-form';
import { TransportationDriverService } from '../../services/transportation-driver.service';
import { MatTableModule } from '@angular/material/table';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-transportation-driver',
  imports: [SimpleListContainerComponent, MatTableModule, RouterLink, RouterLinkActive],
  templateUrl: './transportation-driver-list.component.html',
  styleUrl: './transportation-driver-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportationDriverListComponent {
  drivers = inject(TransportationDriverService).drivers;
  displayColumns = ['name'];
}
