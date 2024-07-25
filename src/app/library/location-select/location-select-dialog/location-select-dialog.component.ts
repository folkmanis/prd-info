import { ChangeDetectionStrategy, Component, effect, Inject, inject, signal } from '@angular/core';
import { GoogleMap, MapAdvancedMarker, MapGeocoder } from '@angular/google-maps';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContainer, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { filter, map } from 'rxjs';

export interface LocationSelectDialogData {
  address?: string;
  googleId?: string;
}

export interface ShippingMarker {
  address: string;
  googleId: string;
  location: google.maps.LatLngLiteral;
  country?: string;
  zip?: string;
}

const MAP_ID = 'ef56afe33b02cace';

@Component({
  selector: 'app-location-select-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogTitle, MatDialogContainer, GoogleMap, MapAdvancedMarker, MatButton, MatDialogClose, MatDialogActions],
  templateUrl: './location-select-dialog.component.html',
  styleUrl: './location-select-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationSelectDialogComponent {
  private geoCoder = inject(MapGeocoder);

  mapOptions: google.maps.MapOptions = { fullscreenControl: false, mapId: MAP_ID };

  center = signal<google.maps.LatLngLiteral>({
    lat: 57.0,
    lng: 24.0,
  });

  zoom = signal(14);

  shippingMarker = signal<ShippingMarker | null>(null);

  constructor(@Inject(MAT_DIALOG_DATA) data: LocationSelectDialogData) {
    if (data.googleId) {
      this.setMarker({ placeId: data.googleId });
    } else if (data.address) {
      this.setMarker({ address: data.address });
    }

    effect(() => console.log(this.shippingMarker()));
  }

  onMarkerDragEnd(event: google.maps.MapMouseEvent) {
    this.setMarker({ location: event.latLng });
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    this.setMarker({ location: event.latLng });
  }

  private setMarker(request: google.maps.GeocoderRequest) {
    this.geoCoder
      .geocode(request)
      .pipe(
        filter((response) => response.status === 'OK'),
        map((response) => response.results),
        map((results) => results.filter(({ types }) => types.includes('street_address') || types.includes('premise'))),
        filter((results) => results.length > 0),
        map((results) => results[0]),
      )
      .subscribe((result) => {
        //  && result.types.includes('street_address')
        const oldMarker = this.shippingMarker();
        const country = result.address_components.find((component) => component.types.includes('country'))?.short_name;
        const zip = result.address_components.find((component) => component.types.includes('postal_code'))?.long_name;
        const location = result.geometry.location.toJSON();

        this.shippingMarker.set({
          location,
          address: result.formatted_address,
          googleId: result.place_id,
          country,
          zip: `${country}-${zip}`,
        });
        if (oldMarker === null) {
          this.center.set(location);
        }
      });
  }
}
