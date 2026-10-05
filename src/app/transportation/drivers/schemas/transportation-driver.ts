import { optionalToNullable } from 'src/app/library';
import { z } from 'zod';

export const DriverSchema = z.object({
  _id: z.string(),
  name: z.string().nonempty(),
  disabled: z.boolean(),
  description: z.string().optional(),
});
export type Driver = z.infer<typeof DriverSchema>;

export const DriverListSchema = DriverSchema.pick({
  _id: true,
  name: true,
  disabled: true,
});
export type DriverList = z.infer<typeof DriverListSchema>;

export const DriverUpdateSchema = optionalToNullable(DriverSchema).partial().omit({ _id: true });
export type DriverUpdate = z.infer<typeof DriverUpdateSchema>;

export const DriverCreateSchema = DriverSchema.omit({ _id: true });
export type DriverCreate = z.infer<typeof DriverCreateSchema>;

export const RouteSheetDriverSchema = DriverSchema.pick({
  _id: true,
  name: true,
});
export type RouteSheetDriver = z.infer<typeof RouteSheetDriverSchema>;
