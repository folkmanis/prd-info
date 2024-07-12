import { ChangeDetectionStrategy, Component, booleanAttribute, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-paytraq-search-header',
  standalone: true,
  templateUrl: './paytraq-search-header.component.html',
  styleUrls: ['./paytraq-search-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, MatButtonModule],
})
export class PaytraqSearchHeaderComponent {
  search = model.required<string>();

  disabled = input(false, { transform: booleanAttribute });

  submit = output();

  onSubmit() {
    this.submit.emit();
  }
}
