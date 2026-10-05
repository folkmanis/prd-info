import { DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ConfirmationDirective } from 'src/app/library/confirmation-dialog';
import { RouteSheet } from '../../schemas';

@Component({
  selector: 'app-general-info',
  imports: [MatCardModule, MatButton, ConfirmationDirective, DatePipe],
  templateUrl: './general-info.component.html',
  styleUrl: './general-info.component.scss',
})
export class GeneralInfoComponent {
  routeSheet = input.required<RouteSheet>();
  busy = input(false);
  edit = output<void>();
  delete = output<void>();

  protected date = computed(() => {
    const { year, month } = this.routeSheet();
    return new Date(year, month - 1);
  });
}
