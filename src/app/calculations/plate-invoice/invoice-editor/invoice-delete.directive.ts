import { Directive, HostListener, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { InvoicesService } from '../../services/invoices.service';

@Directive({
  selector: 'button[appInvoiceDelete]',
  standalone: true,
})
export class InvoiceDeleteDirective {

  @Input('appInvoiceDelete') invoiceId: string;

  @Input('appAfterDeleteMessage') message: string | undefined;

  constructor(
    private invoicesService: InvoicesService,
    private confirmation: ConfirmationDialogService,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
  ) { }

  @HostListener('click')
  onClick() {
    if (!this.invoiceId) {
      return true;
    }
    this.confirmation.confirmDelete().pipe(
      mergeMap(resp => resp ? this.invoicesService.deleteInvoice(this.invoiceId) : EMPTY),
      filter(resp => resp > 0),
    ).subscribe(resp => {
      if (this.message) {
        this.snack.open(this.message, 'OK', { duration: 5000 });
      }
      this.router.navigate(['..'], { relativeTo: this.route });
    });
    return false;
  }

}
