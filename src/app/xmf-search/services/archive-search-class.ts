export interface ArchiveResp {
    count: number;
    data?: Array<ArchiveRecord>;
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

interface Count {_id: string, count: number};
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
