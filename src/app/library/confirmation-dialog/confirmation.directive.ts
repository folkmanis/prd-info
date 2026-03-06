import { Directive, inject, input, output } from '@angular/core';
import { ConfirmationDialogService } from './confirmation-dialog.service';
import { firstValueFrom } from 'rxjs';

@Directive({
  selector: '[appConfirmation]',
  host: {
    '(click)': 'onClick($event)',
  },
})
export class ConfirmationDirective {
  type = input<'delete' | 'discard' | null | undefined>(undefined, { alias: 'appConfirmation' });

  message = input<string>('Apstipriniet', { alias: 'appConfirmationMessage' });

  #confirmationService = inject(ConfirmationDialogService);

  appConfirmedClick = output<PointerEvent>();

  async onClick(event: PointerEvent) {
    event.preventDefault();
    let result = false;
    switch (this.type()) {
      case 'delete':
        result = await this.#confirmationService.confirmDelete();
        break;

      case 'discard':
        result = await firstValueFrom(this.#confirmationService.discardChanges());
        break;

      default:
        result = await firstValueFrom(this.#confirmationService.confirm(this.message()));
        break;
    }
    if (result) {
      this.appConfirmedClick.emit(event);
    }
  }
}
