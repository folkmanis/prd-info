import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, switchMap } from 'rxjs/operators';
import { PasutijumiService } from '../../services/pasutijumi.service';

const PROMPT = `Vai tiešām dzēst visus neaktīvos pasūtījumus
un tiem atbilstošos pakošanas sarakstus?`;

@Component({
  selector: 'app-tabula-buttons',
  templateUrl: './tabula-buttons.component.html',
  styleUrls: ['./tabula-buttons.component.css']
})

export class TabulaButtonsComponent implements OnInit {

  constructor(
    private pasutijumiService: PasutijumiService,
    private snackBar: MatSnackBar,
    private confirmationDialogService: ConfirmationDialogService,
  ) { }

  ngOnInit(): void {
  }

  onCleanup() {
    this.confirmationDialogService.confirm(PROMPT).pipe(
      filter(resp => resp),
      switchMap(() => this.pasutijumiService.cleanup()),
    ).subscribe(resp => {
      this.snackBar.open(
        resp
          ? `Likvidēti ${resp.orders} pasūtījumi un ${resp.veikali} pakošanas ieraksti`
          : 'Kaut kas nogāja greizi',
        'OK',
        { duration: 3000 });
    });
  }


}
