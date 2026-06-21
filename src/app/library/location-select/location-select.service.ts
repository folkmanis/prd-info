import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  LocationSelectDialogComponent,
  LocationSelectDialogData,
} from './location-select-dialog/location-select-dialog.component';
import { Observable } from 'rxjs';
import { ShippingMarker } from './shipping-marker';

@Injectable({
  providedIn: 'root',
})
export class LocationSelectService {
  private dialog = inject(MatDialog);

  getLocation(location: LocationSelectDialogData): Observable<ShippingMarker | undefined> {
    const config: MatDialogConfig<LocationSelectDialogData> = {
      minHeight: '300px',
      minWidth: '300px',
      height: '80vh',
      width: '80vw',
      data: location,
    };
    return this.dialog.open(LocationSelectDialogComponent, config).afterClosed();
  }
}
