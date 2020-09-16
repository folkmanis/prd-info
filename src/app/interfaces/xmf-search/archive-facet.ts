export interface Count { _id: string; count: number; selected: boolean; }

export interface ArchiveFacet {
    [key: string]: Count[];
    customerName: Count[];
    year: Count[];
    month: Count[];
}
