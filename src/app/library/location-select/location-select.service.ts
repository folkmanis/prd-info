import { computed, inject, Service } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  LocationSelectDialogComponent,
  LocationSelectDialogData,
} from './location-select-dialog/location-select-dialog.component';
import { Observable } from 'rxjs';
import { ShippingMarker } from './shipping-marker';
import { configuration } from 'src/app/services/config.provider';
import { notNullOrThrow } from '../assert-utils';

export interface Location {
  address?: string;
  googleId?: string;
}

@Service()
export class LocationSelectService {
  private dialog = inject(MatDialog);

  #mapId = configuration('system', 'mapId');

  serviceEnabled = computed(() => !!this.#mapId());

  getLocation(location: Location): Observable<ShippingMarker | undefined> {
    const mapId = notNullOrThrow(this.#mapId(), 'MAP_ID not configured');
    const config: MatDialogConfig<LocationSelectDialogData> = {
      minHeight: '300px',
      minWidth: '300px',
      height: '80vh',
      width: '80vw',
      data: { ...location, mapId },
    };
    return this.dialog.open(LocationSelectDialogComponent, config).afterClosed();
  }
}
