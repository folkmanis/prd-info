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
    total: number;
    uzlime: boolean;
  };
  kaste: number;
  loading?: boolean;
}

export interface Totals {
  total: number;
  kastesRemain: number;
  labelsRemain: number;
  colorMap: Map<string, { total: number; style: { color: string; }; }>;

}
