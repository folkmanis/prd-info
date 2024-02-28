import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, numberAttribute, signal, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DrawerButtonDirective } from '../../library/side-button/drawer-button.directive';
import { ViewSizeModule } from '../../library/view-size/view-size.module';
import { KastesJob } from '../interfaces';
import { AddressPackage } from '../interfaces/address-package';
import { kastesPreferences } from '../services/kastes-preferences.service';
import { KasteDialogComponent, KasteDialogData } from './kaste-dialog/kaste-dialog.component';
import { LabelStatus, LabelsComponent } from './labels/labels.component';
import { OrderTotalsComponent } from './order-totals/order-totals.component';
import { KastesTabulaService } from './services/kastes-tabula.service';
import { TabulaComponent } from './tabula/tabula.component';
import { TotalsForSelectedSizeComponent } from './totals-for-selected-size/totals-for-selected-size.component';


@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatSidenavModule,
    MatTabsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    TabulaComponent,
    ViewSizeModule,
    DrawerButtonDirective,
    MatDividerModule,
    LabelsComponent,
    OrderTotalsComponent,
    KasteDialogComponent,
    TotalsForSelectedSizeComponent,
  ],
})
export class SelectorComponent {

  private tabulaService = inject(KastesTabulaService);
  private dialog = inject(MatDialog);

  private table = viewChild(TabulaComponent);

  activeBoxSize = input<number, string>(0, { transform: numberAttribute });

  jobId = kastesPreferences('pasutijums');

  showCompleted = model(true);

  boxSizes = signal<number[]>([]);

  packagesJob = signal<KastesJob | null>(null);

  allAddressPackages = signal<AddressPackage[]>([]);

  packagesFilteredBySize = computed(() => {
    const activeBoxSize = this.activeBoxSize();
    return this.allAddressPackages()
      .filter(pack => activeBoxSize === 0 || pack.total === activeBoxSize);
  });

  packagesToDisplay = computed(() => {
    const showCompleted = this.showCompleted();
    return this.packagesFilteredBySize()
      .filter(pack => showCompleted || pack.completed === false);
  });

  labelStatus = signal<LabelStatus>({ type: 'none' });


  constructor() {
    effect(async () => {
      if (this.jobId()) {
        const packages = await this.tabulaService.getAddressPackages(this.jobId());
        this.allAddressPackages.set(packages);
      }
    }, { allowSignalWrites: true });

    effect(async () => {
      if (this.jobId()) {
        this.boxSizes.set(
          await this.tabulaService.getBoxSizeQuantities(this.jobId())
        );
      }
    }, { allowSignalWrites: true });

    effect(async () => {
      if (this.jobId()) {
        const job = await this.tabulaService.getKastesJob(this.jobId());
        this.packagesJob.set(job);
      }
    }, { allowSignalWrites: true });

    effect(() => {
      this.activeBoxSize();
      this.table()?.scrollToTop();
    });
  }

  async onSelection(addressPackage: AddressPackage) {

    const config: MatDialogConfig<KasteDialogData> = {
      data: {
        addressPackage,
        allAddressPackages: this.allAddressPackages().filter(pack => pack.addressId === addressPackage.addressId),
      },
      minWidth: '300px',
      minHeight: '500px',
    };

    const dialogRef = this.dialog.open(KasteDialogComponent, config);

    const result: boolean | undefined = await firstValueFrom(dialogRef.afterClosed());

    if (typeof result !== 'boolean') {
      return;
    }

    const updatedPackage = await this.tabulaService.setCompleted(addressPackage.documentId, addressPackage.boxSequence, result);

    this.replacePackage(updatedPackage);

  }

  async onSetLabel(addressId: number) {

    try {

      const updatedPackage = await this.tabulaService.setHaslabel(this.jobId(), addressId);
      this.replacePackage(updatedPackage);
      this.labelStatus.set({ type: 'kaste', addressPackage: updatedPackage });
      this.table().scrollToId(updatedPackage.documentId, updatedPackage.boxSequence);

    } catch (error) {
      this.labelStatus.set({ type: 'empty' });
    }

  }

  private replacePackage(updatedPackage: AddressPackage) {

    const updatedPackages = this.tabulaService.replacePackage(this.allAddressPackages(), updatedPackage);
    this.allAddressPackages.set(updatedPackages);

  }

}
