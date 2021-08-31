export interface JobProductionStageMaterial {
    materialId: string;
    name?: string;
    amount: number;
    fixedAmount: number;
}

export interface JobProductionStage {
    productionStageId: string;
    name?: string;
    materials: JobProductionStageMaterial[];
    amount: number;
    fixedAmount: number;
    productionStatus?: number;

}