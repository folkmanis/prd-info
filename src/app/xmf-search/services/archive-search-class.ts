export interface ArchiveResp {
    count: number;
    data: Array<ArchiveRecord>;
    facet: ArchiveFacet;
}

export interface ArchiveRecord {
    JDFJobID: string;
    DescriptiveName: string;
    CustomerName: string;
    Archives: {
        Location: string,
        Date: string,
        Action: number,
    }[];
}

interface Count { _id: string, count: number, selected: boolean; };

export interface ArchiveFacet {
    customerName: Count[],
    year: Count[],
    month: Count[],
}

export interface FacetFilter {
    customerName: string[],
    year: number[],
    month: number[],
}

export interface SearchQuery {
    q: string;
    customers?: string[];
    year?: number[];
    month?: number[];
}
