export interface ParsedTable {
  headers: string[]
  rows: string[][]
}

export function parseMarkdownTable(content: string): ParsedTable | null {
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean)
  const tableStart = lines.findIndex(l => l.startsWith('|') && l.endsWith('|'))
  if (tableStart === -1) return null

  const tableLines = lines.slice(tableStart).filter(
    l => l.startsWith('|') && !l.match(/^\|[-| :]+\|$/)
  )
  if (tableLines.length < 2) return null

  const parseRow = (line: string) =>
    line.split('|').slice(1, -1).map(cell => cell.trim())

  const headers = parseRow(tableLines[0])
  const rows = tableLines.slice(1).map(parseRow)

  return { headers, rows }
}

const SKIP_HEADERS = new Set(['id', 'no', '#', 'num', 'number', 'row', 'index'])

export function getNumericColumns(table: ParsedTable): number[] {
  return table.headers.reduce<number[]>((acc, header, colIdx) => {
    if (SKIP_HEADERS.has(header.toLowerCase())) return acc
    const isNumeric = table.rows.every(row => {
      const val = row[colIdx]?.replace(/,/g, '')
      return val !== undefined && val !== '' && !isNaN(Number(val))
    })
    if (isNumeric) acc.push(colIdx)
    return acc
  }, [])
}
