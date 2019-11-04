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


export type PartialSearchQuery = { [P in keyof SearchQuery]?: SearchQuery[P] };

interface SearchQuery {
  q: string;
  customers?: string[];
}
