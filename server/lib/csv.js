/**
 * CSV cells that start with =, +, -, or @ are formulas in Excel and Sheets.
 * A name submitted as =HYPERLINK(...) would run when staff open the export.
 * Prefix those cells with a single quote so the spreadsheet stores text.
 * A plain number, including a negative one, is left alone.
 */

function neutralizeFormula(value) {
  if (/^-?\d+(\.\d+)?$/.test(value)) return value;
  if (/^[\t\r\n ]*[=+\-@]/.test(value)) return `'${value}`;
  return value;
}

function escapeCsv(value) {
  if (value === null || value === undefined) return '';
  const raw = typeof value === 'string' ? value : JSON.stringify(value);
  const str = neutralizeFormula(raw);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowsToCsv(rows, columns) {
  const header = columns.map((column) => escapeCsv(column.label)).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((column) =>
          escapeCsv(typeof column.value === 'function' ? column.value(row) : row[column.value])
        )
        .join(',')
    )
    .join('\n');
  return `${header}\n${body}\n`;
}

module.exports = { escapeCsv, neutralizeFormula, rowsToCsv };
