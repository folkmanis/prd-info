import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { PaytraqProduct } from 'src/app/interfaces/paytraq';

@Component({
  selector: 'app-paytraq-product-table',
  standalone: true,
  templateUrl: './paytraq-product-table.component.html',
  styleUrls: ['./paytraq-product-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
  ]
})
export class PaytraqProductTableComponent {

  products = input<PaytraqProduct[]>([]);

  productSelected = output<PaytraqProduct>();

  displayedColumns: (keyof PaytraqProduct)[] = ['itemID', 'name'];

}
