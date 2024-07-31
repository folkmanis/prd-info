import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { TransportationDriverService } from '../services/transportation-driver.service';

@Component({
  selector: 'app-transportation-driver-edit',
  standalone: true,
  imports: [SimpleFormContainerComponent],
  templateUrl: './transportation-driver-edit.component.html',
  styleUrl: './transportation-driver-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportationDriverEditComponent {
  private driverService = inject(TransportationDriverService);
}
