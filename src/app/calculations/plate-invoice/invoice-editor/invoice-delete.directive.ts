import { Directive, Input, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { InvoicesService } from '../../services/invoices.service';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

@Directive({
  selector: 'button[appInvoiceDelete]'
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
