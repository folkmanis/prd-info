export interface Kaste {
  _id: string;
  kods: number;
  adrese: string;
  pasutijums: string;
  kastes: {
    yellow: number;
    rose: number;
    white: number;
    gatavs: boolean;
    total?: number;
    uzlime: boolean;
  };
  kaste: number;
}
