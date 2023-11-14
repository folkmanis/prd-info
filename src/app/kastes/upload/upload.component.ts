import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  signal,
} from '@angular/core';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, map, shareReplay, switchMap } from 'rxjs/operators';
import { jobProductsToColorTotals } from '../common';
import { ColorTotals } from '../interfaces';
import { KastesJobPartial } from '../interfaces/kastes-job-partial';
import { KastesPasutijumiService } from '../services/kastes-pasutijumi.service';
import {
  getKastesPreferences,
  KastesPreferencesService,
} from '../services/kastes-preferences.service';
import { EndDialogComponent } from './end-dialog/end-dialog.component';
import { AdresesBoxes } from './services/adrese-box';
import { UploadAdresesComponent } from './upload-adreses/upload-adreses.component';
import { ScrollTopDirective } from '../../library/scroll-to-top/scroll-top.directive';
import { PortalModule } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { ColorTotalsComponent } from '../common/color-totals/color-totals.component';
import { KastesTabulaDropDirective } from './kastes-tabula-drop.directive';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatCardModule,
    KastesTabulaDropDirective,
    ColorTotalsComponent,
    MatButtonModule,
    PortalModule,
    ScrollTopDirective,
    UploadAdresesComponent,
    AsyncPipe,
  ],
})
export class UploadComponent {
  adresesBox: AdresesBoxes | undefined;

  orderIdControl = new FormControl<number>(null, [Validators.required]);

  plannedTotals$: Observable<ColorTotals[]> =
    this.orderIdControl.valueChanges.pipe(
      filter((id) => id != null),
      switchMap((id) => this.pasutijumiService.getKastesJob(+id)),
      map((job) => jobProductsToColorTotals(job.products))
    );

  inputData = signal<Array<string | number>[]>([]);

  orders$: Observable<KastesJobPartial[]> =
    this.pasutijumiService.getKastesJobs({});

  colors$ = getKastesPreferences('colors');

  constructor(
    private pasutijumiService: KastesPasutijumiService,
    private preferences: KastesPreferencesService,
    private matDialog: MatDialog,
    private router: Router
  ) {}

  onXlsDrop(file: File | undefined) {
    this.pasutijumiService
      .parseXlsx(file)
      .subscribe((data) => this.inputData.set(data));
  }

  onSave(adrBox: AdresesBoxes) {
    const orderId = this.orderIdControl.value;
    if (!orderId) {
      return;
    }
    this.pasutijumiService
      .addKastes(adrBox.uploadRows(orderId))
      .pipe(
        switchMap((affectedRows) =>
          this.matDialog
            .open(EndDialogComponent, { data: affectedRows })
            .afterClosed()
        ),
        switchMap(() =>
          this.preferences.updateUserPreferences({ pasutijums: orderId })
        )
      )
      .subscribe(() => this.router.navigate(['kastes', 'edit', orderId]));
  }
}
