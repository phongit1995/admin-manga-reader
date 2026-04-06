import type { PaletteColor, ColorSystemOptions, PaletteColorChannel } from '@mui/material/styles';

import { varAlpha, createPaletteChannel } from 'minimal-shared/utils';

import { themeConfig } from '../theme-config';

import type { ThemeColorScheme } from '../types';

export type PaletteColorKey = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

export type PaletteColorNoChannels = Omit<PaletteColor, 'lighterChannel' | 'darkerChannel'>;

export type PaletteColorWithChannels = PaletteColor & PaletteColorChannel;

export type CommonColorsExtend = {
  whiteChannel: string;
  blackChannel: string;
};

export type TypeTextExtend = {
  disabledChannel: string;
};

export type TypeBackgroundExtend = {
  neutral: string;
  neutralChannel: string;
};

export type PaletteColorExtend = {
  lighter: string;
  darker: string;
  lighterChannel: string;
  darkerChannel: string;
};

export type GreyExtend = {
  '50Channel': string;
  '100Channel': string;
  '200Channel': string;
  '300Channel': string;
  '400Channel': string;
  '500Channel': string;
  '600Channel': string;
  '700Channel': string;
  '800Channel': string;
  '900Channel': string;
};

export const primary = createPaletteChannel(themeConfig.palette.primary);

export const secondary = createPaletteChannel(themeConfig.palette.secondary);

export const info = createPaletteChannel(themeConfig.palette.info);

export const success = createPaletteChannel(themeConfig.palette.success);

export const warning = createPaletteChannel(themeConfig.palette.warning);

export const error = createPaletteChannel(themeConfig.palette.error);

export const common = createPaletteChannel(themeConfig.palette.common);

export const grey = createPaletteChannel(themeConfig.palette.grey);

export const text = {
  light: createPaletteChannel({
    primary: grey[800],
    secondary: grey[600],
    disabled: grey[500],
  }),
};

export const background = {
  light: createPaletteChannel({
    paper: '#FFFFFF',
    default: grey[100],
    neutral: grey[200],
  }),
};

export const baseAction = {
  hover: varAlpha(grey['500Channel'], 0.08),
  selected: varAlpha(grey['500Channel'], 0.16),
  focus: varAlpha(grey['500Channel'], 0.24),
  disabled: varAlpha(grey['500Channel'], 0.8),
  disabledBackground: varAlpha(grey['500Channel'], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

export const action = {
  light: { ...baseAction, active: grey[600] },
};

export const basePalette = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  common,
  grey,
  divider: varAlpha(grey['500Channel'], 0.2),
};

export const palette: Partial<Record<ThemeColorScheme, ColorSystemOptions['palette']>> = {
  light: {
    ...basePalette,
    text: text.light,
    background: background.light,
    action: action.light,
  },
};
