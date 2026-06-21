export interface ShippingMarker {
  address: string;
  googleId: string;
  location: google.maps.LatLngLiteral;
  country?: string;
  zip?: string;
}
