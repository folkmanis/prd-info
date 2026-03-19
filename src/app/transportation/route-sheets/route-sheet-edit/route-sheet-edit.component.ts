import { ChangeDetectionStrategy, Component, inject, input, linkedSignal, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { assertNotNull } from 'src/app/library';
import { CanComponentDeactivate } from 'src/app/library/guards';
import { navigateRelative } from 'src/app/library/navigation';
import { SimpleContentContainerComponent } from 'src/app/library/simple-form/simple-content-container/simple-content-container.component';
import { updateCatching } from 'src/app/library/update-catching';
import {
  TransportationRouteSheet,
  TransportationRouteSheetCreate,
  TransportationRouteSheetUpdate,
} from '../../interfaces/transportation-route-sheet';
import { RouteSheetService } from '../../services/route-sheet.service';
import { RouteSheetListComponent } from '../route-sheet-list/route-sheet-list.component';
import { FuelPurchasesComponent } from './fuel-purchases/fuel-purchases.component';
import { GeneralInfoComponent } from './general-info/general-info.component';
import { GeneralSetupComponent } from './general-setup/general-setup.component';
import { RouteTripsComponent } from './route-trips/route-trips.component';

@Component({
  selector: 'app-route-sheet-edit',
  imports: [
    SimpleContentContainerComponent,
    MatButtonModule,
    FuelPurchasesComponent,
    GeneralSetupComponent,
    RouteTripsComponent,
    GeneralInfoComponent,
  ],
  templateUrl: './route-sheet-edit.component.html',
  styleUrl: './route-sheet-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteSheetEditComponent implements CanComponentDeactivate {
  readonly #routeSheetService = inject(RouteSheetService);
  #navigate = navigateRelative();
  #listComponent = inject(RouteSheetListComponent);
  protected generalSetup = viewChild(GeneralSetupComponent);

  protected busy = signal(false);
  readonly #updateFn = updateCatching(this.busy);

  routeSheet = input.required<TransportationRouteSheet>();
  protected initialValue = linkedSignal(() => this.routeSheet());

  protected editActive = linkedSignal(() => (this.initialValue()._id ? false : true));

  canDeactivate = () => this.editActive() === false || this.generalSetup()!.canDeactivate();

  async onCreate(create: TransportationRouteSheetCreate) {
    await this.#updateFn(async (message) => {
      const created = await this.#routeSheetService.createRouteSheet(create);
      message(`Ieraksts izveidots!`);
      this.#navigate(['..', created._id]);
      this.#listComponent.onReload();
    });
  }

  async onUpdate(update: TransportationRouteSheetUpdate) {
    await this.#updateFn(async (message) => {
      const { _id: id } = this.initialValue();
      const updated = await this.#routeSheetService.updateRouteSheet(id, update);
      this.initialValue.set(updated);
      message(`Dati saglabāti!`);
      this.#listComponent.onReload();
    });
  }

  async onDelete() {
    this.#updateFn(async (message) => {
      const { _id: id } = this.initialValue();
      assertNotNull(id);
      await this.#routeSheetService.deleteRouteSheet(id);
      message(`Ieraksts izdzēsts!`);
      this.#navigate(['..']);
      this.#listComponent.onReload();
    });
  }
}
