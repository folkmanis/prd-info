import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

export interface ConsumptionData {
  month: string;
  mileage: number;
  consumed: number;
  consumptionRate: number;
}

@Component({
  selector: 'app-consumption-table',
  imports: [MatTableModule, DecimalPipe],
  templateUrl: './consumption-table.component.html',
  styleUrl: './consumption-table.component.scss',
})
export class ConsumptionTableComponent {
  protected columns = ['month', 'mileage', 'consumed', 'consumptionRate'];

  consumptionData = input<ConsumptionData[]>([]);

  units = input('');

  average = input(Number.POSITIVE_INFINITY);
}
