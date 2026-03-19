import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ConfirmationDirective } from 'src/app/library/confirmation-dialog';
import { TransportationRouteSheet } from 'src/app/transportation/interfaces/transportation-route-sheet';

@Component({
  selector: 'app-general-info',
  imports: [MatCardModule, MatButton, ConfirmationDirective, DatePipe],
  templateUrl: './general-info.component.html',
  styleUrl: './general-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralInfoComponent {
  routeSheet = input.required<TransportationRouteSheet>();
  busy = input(false);
  edit = output<void>();
  delete = output<void>();

  protected date = computed(() => {
    const { year, month } = this.routeSheet();
    return new Date(year, month - 1);
  });
}
