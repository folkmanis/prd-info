import { z } from 'zod';

export const KastesColorsSettings = z.object({
  rose: z.string(),
  white: z.string(),
  yellow: z.string(),
});

export const KastesSettings = z.object({
  colors: KastesColorsSettings,
});
export type KastesSettings = z.infer<typeof KastesSettings>;

export const Colors = KastesColorsSettings.keyof();
export type Colors = z.infer<typeof Colors>;
export const COLORS = Colors.options;
