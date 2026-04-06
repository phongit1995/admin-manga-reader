import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export type HeadLabelItem = {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: number;
  minWidth?: number;
};

type CommonTableHeadProps = {
  headLabel: HeadLabelItem[];
  // Checkbox select-all (optional — omit to hide checkbox column)
  rowCount?: number;
  numSelected?: number;
  onSelectAllClick?: (checked: boolean) => void;
};

export function CommonTableHead({
  headLabel,
  rowCount,
  numSelected,
  onSelectAllClick,
}: CommonTableHeadProps) {
  const showCheckbox =
    rowCount !== undefined && numSelected !== undefined && onSelectAllClick !== undefined;

  return (
    <TableHead>
      <TableRow>
        {showCheckbox && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onSelectAllClick(event.target.checked)
              }
            />
          </TableCell>
        )}

        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
