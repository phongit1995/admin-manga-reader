export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

export function fDate(date: string | number | Date | null | undefined): string {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
} 