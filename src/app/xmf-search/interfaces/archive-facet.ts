export interface FacetCount {
    _id: string;
    count: number;
    selected: boolean;
}

export interface ArchiveFacet {
    customerName: FacetCount[];
    year: FacetCount[];
    month: FacetCount[];
}
