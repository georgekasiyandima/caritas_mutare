const { escapeCsv, rowsToCsv } = require('../lib/csv');

describe('CSV formula neutralising', () => {
  it('prefixes cells that a spreadsheet would treat as formulas', () => {
    expect(escapeCsv('=HYPERLINK("http://evil")')).toBe('"\'=HYPERLINK(""http://evil"")"');
    expect(escapeCsv('+1+1')).toBe("'+1+1");
    expect(escapeCsv('-1+1')).toBe("'-1+1");
    expect(escapeCsv('@SUM(A1)')).toBe("'@SUM(A1)");
  });

  it('leaves ordinary text and real numbers alone', () => {
    expect(escapeCsv('Chipo Moyo')).toBe('Chipo Moyo');
    expect(escapeCsv('-12.50')).toBe('-12.50');
    expect(escapeCsv(20)).toBe('20');
  });

  it('still quotes commas after the formula prefix', () => {
    const csv = rowsToCsv([{ name: '=1,2' }], [{ label: 'Name', value: 'name' }]);
    expect(csv).toContain('"\'=1,2"');
  });
});
