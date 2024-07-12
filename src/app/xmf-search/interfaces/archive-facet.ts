export interface FacetCount {
  _id: string;
  count: number;
  selected: boolean;
}

export class ArchiveFacet {
  customerName: FacetCount[] = [];
  year: FacetCount[] = [];
  month: FacetCount[] = [];
}
