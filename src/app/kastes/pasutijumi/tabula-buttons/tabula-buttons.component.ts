import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, switchMap } from 'rxjs/operators';
import { PasutijumiService } from '../../services/pasutijumi.service';

const PROMPT = `Vai tiešām dzēst visus neaktīvos pakošanas ierakstas?`;

@Component({
  selector: 'app-tabula-buttons',
  templateUrl: './tabula-buttons.component.html',
  styleUrls: ['./tabula-buttons.component.scss']
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
          ? `Likvidēti ${resp} pakošanas ieraksti`
          : 'Nekādas darbības netika veiktas',
        'OK',
        { duration: 3000 });
    });
  }


}
