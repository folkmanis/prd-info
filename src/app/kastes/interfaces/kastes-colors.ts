export const COLORS = ['rose', 'white', 'yellow'] as const;
export type Colors = (typeof COLORS)[number];
