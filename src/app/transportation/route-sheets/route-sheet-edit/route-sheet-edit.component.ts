import { Component, computed, inject, model, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { notNullOrThrow } from 'src/app/library';
import { CanComponentDeactivate } from 'src/app/library/guards';
import { navigateRelative } from 'src/app/library/navigation';
import { SimpleContentContainerComponent } from 'src/app/library/simple-form/simple-content-container/simple-content-container.component';
import { updateCatching } from 'src/app/library/update-catching';
import { FuelPurchasesComponent } from '../fuel-purchases/fuel-purchases.component';
import { RouteSheetListComponent } from '../route-sheet-list/route-sheet-list.component';
import { RouteTripsComponent } from '../route-trips/route-trips.component';
import { RouteSheet, RouteSheetCreate, RouteSheetUpdate } from '../schemas';
import { RouteSheetService } from '../services/route-sheet.service';
import { GeneralInfoComponent } from './general-info/general-info.component';
import { GeneralSetupComponent } from './general-setup/general-setup.component';

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
})
export class RouteSheetEditComponent implements CanComponentDeactivate {
  readonly #routeSheetService = inject(RouteSheetService);
  #navigate = navigateRelative();
  #listComponent = inject(RouteSheetListComponent);
  protected generalSetup = viewChild.required(GeneralSetupComponent);

  protected busy = signal(false);
  readonly #updateFn = updateCatching(this.busy);

  routeSheet = model.required<RouteSheet | null>();

  protected isNew = computed(() => this.routeSheet() === null);

  protected editActive = signal(false);

  canDeactivate = () => this.editActive() === false || this.generalSetup().canDeactivate();

  async onCreate(create: RouteSheetCreate) {
    await this.#updateFn(async (message) => {
      const created = await this.#routeSheetService.createRouteSheet(create);
      this.editActive.set(false);
      message(`Ieraksts izveidots!`);
      this.#navigate(['..', created._id]);
      this.#listComponent.onReload();
    });
  }

  async onUpdate(update: RouteSheetUpdate) {
    await this.#updateFn(async (message) => {
      const { _id: id } = notNullOrThrow(this.routeSheet());
      const updated = await this.#routeSheetService.updateRouteSheet(id, update);
      this.editActive.set(false);
      this.routeSheet.set(updated);
      message(`Dati saglabāti!`);
      this.#listComponent.onReload();
    });
  }

  async onDelete() {
    this.#updateFn(async (message) => {
      const { _id: id } = notNullOrThrow(this.routeSheet());
      await this.#routeSheetService.deleteRouteSheet(id);
      message(`Ieraksts izdzēsts!`);
      this.#navigate(['..']);
      this.#listComponent.onReload();
    });
  }
}
