import type { Theme, SxProps } from '@mui/material/styles';
// @ts-expect-error simplebar-react module resolution issue
import type { Props as SimplebarProps } from 'simplebar-react';

// ----------------------------------------------------------------------

export type ScrollbarProps = SimplebarProps &
  React.ComponentProps<'div'> & {
    sx?: SxProps<Theme>;
    fillContent?: boolean;
    slotProps?: {
      wrapperSx?: SxProps<Theme>;
      contentSx?: SxProps<Theme>;
      contentWrapperSx?: SxProps<Theme>;
    };
  };
