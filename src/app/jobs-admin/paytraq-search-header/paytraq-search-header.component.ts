import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Output, booleanAttribute, input, model, output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-paytraq-search-header',
  standalone: true,
  templateUrl: './paytraq-search-header.component.html',
  styleUrls: ['./paytraq-search-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class PaytraqSearchHeaderComponent {

  search = model.required<string>();

  disabled = input(false, { transform: booleanAttribute });

  submit = output();

  onSubmit() {
    this.submit.emit();
  }

}
