export interface Count {
    _id: string;
    count: number;
    selected: boolean;
}

export interface ArchiveFacet {
    customerName: Count[];
    year: Count[];
    month: Count[];
}
