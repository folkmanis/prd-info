export interface ArchiveResp {
    count: number;
    data?: Array<ArchiveRecord>;
}

export interface ArchiveRecord {
    id: number;
    jdfJobId: string;
    descriptiveName: string;
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
    archive:
    {
        location: string;
        action: string;
        date: string;
        datums: string;
    }[];
}
