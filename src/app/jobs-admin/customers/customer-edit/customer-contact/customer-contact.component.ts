import { Component, input, model, ModelSignal, output } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-customer-contact',
  imports: [MatIcon, MatIconButton],
  templateUrl: './customer-contact.component.html',
  styleUrl: './customer-contact.component.scss',
})
export class CustomerContactComponent implements FormValueControl<string> {
  value: ModelSignal<string> = model('');

  active = input(false);

  delete = output<void>();
}
