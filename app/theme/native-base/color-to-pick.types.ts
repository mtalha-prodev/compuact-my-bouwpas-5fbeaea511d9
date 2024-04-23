export interface IColorShades {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface IColorSingleShade {
  500: string;
}

export const colorPickLevel = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type TColorPickLevel = (typeof colorPickLevel)[number];

export const colorPickName = [
  'bp-primary',
  'bp-support',
  'bp-accent',
  'bp-support-gray',
  'bp-support-cultured',
  'bp-correct',
  'bp-cancel',
  'bp-warning',
  'bp-employee',
  'bp-subcontractor',
  'bp-temp',
  'bp-self-employed',
  'bp-red-card',
  'bp-yellow-card',
  'bp-slimmer',
  'bp-veiliger',
  'bp-sneller',
  'bp-toevoegingen',
  'bp-veiliger-2',
] as const;
export type TColorPickName = (typeof colorPickName)[number];

export const colorPickSingleShade = ['bp-valid', 'bp-white', 'bp-black', 'bp-cyan'] as const;
export type TColorPickSingleShade = (typeof colorPickSingleShade)[number];

export interface ICustomColor {
  'bp-primary': IColorShades;
  'bp-support': IColorShades;
  'bp-accent': IColorShades;
  'bp-support-gray': IColorShades;
  'bp-support-cultured': IColorShades;
  'bp-correct': IColorShades;
  'bp-cancel': IColorShades;
  'bp-warning': IColorShades;
  'bp-employee': IColorShades;
  'bp-subcontractor': IColorShades;
  'bp-temp': IColorShades;
  'bp-self-employed': IColorShades;
  'bp-red-card': IColorShades;
  'bp-yellow-card': IColorShades;
  'bp-valid': IColorSingleShade;
  'bp-slimmer': IColorShades;
  'bp-veiliger': IColorShades;
  'bp-sneller': IColorShades;
  'bp-toevoegingen': IColorShades;
  'bp-veiliger-2': IColorShades;
  'bp-white': IColorSingleShade;
  'bp-black': IColorSingleShade;
  'bp-cyan': IColorSingleShade;
}
