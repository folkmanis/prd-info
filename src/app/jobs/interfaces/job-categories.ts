export const JOB_CATEGORIES = ['repro', 'perforated paper', 'print'] as const;

export type JobCategories = typeof JOB_CATEGORIES[number];

export interface ProductionCategory {
    category: JobCategories;
}

export interface ReproProduction extends ProductionCategory {
    category: 'repro';
}

export interface KastesProduction extends ProductionCategory {

    category: 'perforated paper';

    isLocked: boolean; // ir izveidots pakošanas saraksts
}

export interface PrintProduction extends ProductionCategory {
    category: 'print';
}

export type Production = ReproProduction | KastesProduction | PrintProduction;
