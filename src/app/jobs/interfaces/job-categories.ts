import { z } from 'zod/v4';

export const JOB_CATEGORIES = z.enum(['repro', 'perforated paper', 'print']);

export type JobCategories = z.infer<typeof JOB_CATEGORIES>;

export const ProductionCategory = z.object({
  category: JOB_CATEGORIES,
});
export type ProductionCategory = z.infer<typeof ProductionCategory>;

export const ReproProduction = ProductionCategory.extend({
  category: JOB_CATEGORIES.extract(['repro']),
});
export type ReproProduction = z.infer<typeof ReproProduction>;

export const KastesProduction = ProductionCategory.extend({
  category: JOB_CATEGORIES.extract(['perforated paper']),
});

export const PrintProduction = ProductionCategory.extend({
  category: JOB_CATEGORIES.extract(['print']),
});
export type PrintProduction = z.infer<typeof PrintProduction>;
