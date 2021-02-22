export interface ArchiveRecord {
    JDFJobID: string;
    DescriptiveName: string;
    CustomerName: string;
    Archives: {
        Location: string;
        Date: string;
        Action: number;
    }[];
}
