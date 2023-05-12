import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
})
export class PaytraqSearchHeaderComponent {

  @Input() set initial(value: string) {
    this.searchControl.setValue(value);
  }

  @Output() search = new Subject<string>();

  private _disabled = false;
  @Input() set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
    if (this.disabled) {
      this.searchControl.disable();
    } else {
      this.searchControl.enable();
    }
  }
  get disabled(): boolean {
    return this._disabled;
  }

  searchControl = new FormControl<string>('');


}
