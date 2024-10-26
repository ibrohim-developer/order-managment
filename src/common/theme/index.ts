import { createTheme as createMuiTheme, responsiveFontSizes } from '@mui/material/styles';
import { baseThemeOptions } from './base-theme-options';

type Direction = 'ltr' | 'rtl';

export const createTheme = (config: {
  direction: Direction,
  responsiveFontSizes: boolean,
}) => {
  let theme = createMuiTheme(
    baseThemeOptions,
    {
      direction: config.direction,
    },
  );

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
