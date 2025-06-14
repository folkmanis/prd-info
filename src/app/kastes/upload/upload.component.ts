import { ChangeDetectionStrategy, Component, computed, effect, inject, model, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { firstValueFrom } from 'rxjs';
import { navigateRelative } from 'src/app/library/navigation';
import { jobProductsToColorTotals } from '../common/color-totals-from-veikali';
import { ColorTotalsComponent } from '../common/color-totals/color-totals.component';
import { COLORS, Colors } from 'src/app/interfaces';
import { AddressWithPackages, addOrderId, totalsFromAddresesWithPackages } from '../services/item-packing.utilities';
import { KastesPasutijumiService } from '../services/kastes-pasutijumi.service';
import { KastesPreferencesService } from '../services/kastes-preferences.service';
import { EndDialogComponent } from './end-dialog/end-dialog.component';
import { KastesTabulaDropDirective } from './kastes-tabula-drop.directive';
import { UploadAdresesComponent } from './upload-adreses/upload-adreses.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatButtonModule,
    KastesTabulaDropDirective,
    ColorTotalsComponent,
    UploadAdresesComponent,
  ],
})
export class UploadComponent {
  private navigate = navigateRelative();
  private pasutijumiService = inject(KastesPasutijumiService);
  private preferences = inject(KastesPreferencesService);
  private matDialog = inject(MatDialog);

  colors = COLORS;

  adresesBox = signal<AddressWithPackages[] | null>(null);

  orderId = model<number | null>(null);
  plannedTotals = signal<Record<Colors, number> | null>(null);

  inputData = signal<Array<string | number>[]>([]);

  orders = toSignal(this.pasutijumiService.getKastesJobs({}), { initialValue: [] });

  totals = computed(() => totalsFromAddresesWithPackages(this.adresesBox() ?? []));

  orderIdSet = computed(() => isValidOrderId(this.orderId()));

  constructor() {
    effect(async () => {
      const orderId = this.orderId();
      if (isValidOrderId(orderId)) {
        const { products } = await this.pasutijumiService.getKastesJob(orderId);
        this.plannedTotals.set(jobProductsToColorTotals(products || []));
      } else {
        this.plannedTotals.set(null);
      }
    });
  }

  async onXlsDrop(file: File | undefined) {
    const data = await firstValueFrom(this.pasutijumiService.parseXlsx(file));
    this.inputData.set(data);
  }

  async onSave() {
    const orderId = this.orderId();
    const adreses = this.adresesBox();
    if (!orderId || !adreses) {
      return;
    }
    const uploadData = addOrderId(adreses, orderId);
    const affectedRows = await firstValueFrom(this.pasutijumiService.addKastes(uploadData));

    await firstValueFrom(this.preferences.updateUserPreferences({ pasutijums: orderId }));

    this.matDialog.open(EndDialogComponent, { data: affectedRows });

    this.navigate(['/', 'kastes', 'edit', orderId]);
  }
}

function isValidOrderId(orderId: number | null): orderId is number {
  return typeof orderId === 'number' && isFinite(orderId);
}
