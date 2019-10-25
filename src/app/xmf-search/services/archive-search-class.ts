export interface ArchiveResp {
    count: number;
    data?: Array<ArchiveRecord>;
}

export interface ArchiveRecord {
    id: number;
    jdfJobId: string;
    descriptiveName: string;
    customerName: string;
    location: string;
    action: string;
    date: string;
}

export interface ArchiveSearch {
    count: number;
    data: SearchRecord[];
}

export interface SearchRecord {
    id: number;
    jdfJobId: string;
    descriptiveName: string;
    customerName: string;
    archive:
    {
        location: string;
        action: string;
        date: string;
        datums: string;
    }[];
}

export type PartialSearchQuery = { [P in keyof SearchQuery]?: SearchQuery[P] };

interface SearchQuery {
  q: string;
  customers?: string[];
}
