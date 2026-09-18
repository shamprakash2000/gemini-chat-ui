import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { ParsedTable } from '../lib/parseTable'
import { getNumericColumns } from '../lib/parseTable'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

interface Props {
  table: ParsedTable
}

export function TableChart({ table }: Props) {
  const numericCols = getNumericColumns(table)
  const [activeCol, setActiveCol] = useState<number>(numericCols[0] ?? -1)

  if (numericCols.length === 0) return null

  const SKIP_LABEL = new Set(['id', 'no', '#', 'num', 'number', 'row', 'index'])
  const PREFER_LABEL = ['name', 'title', 'label', 'product', 'item', 'description']

  // Prefer meaningful name columns, fall back to first non-numeric non-id column
  const labelColIdx =
    table.headers.findIndex(h => PREFER_LABEL.includes(h.toLowerCase())) !== -1
      ? table.headers.findIndex(h => PREFER_LABEL.includes(h.toLowerCase()))
      : table.headers.findIndex((h, i) => !numericCols.includes(i) && !SKIP_LABEL.has(h.toLowerCase()))
  const labelKey = table.headers[labelColIdx] ?? 'row'

  const data = table.rows.map(row => {
    const entry: Record<string, string | number> = {
      [labelKey]: row[labelColIdx] ?? '',
    }
    numericCols.forEach(colIdx => {
      entry[table.headers[colIdx]] = Number(row[colIdx]?.replace(/,/g, '') ?? 0)
    })
    return entry
  })

  return (
    <div className="mt-3">
      {/* Column selector when multiple numeric columns */}
      {numericCols.length > 1 && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {numericCols.map((colIdx, i) => (
            <button
              key={colIdx}
              onClick={() => setActiveCol(colIdx)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeCol === colIdx
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={activeCol === colIdx ? { backgroundColor: COLORS[i % COLORS.length] } : {}}
            >
              {table.headers[colIdx]}
            </button>
          ))}
        </div>
      )}

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey={labelKey}
            tick={{ fontSize: 10 }}
            angle={-50}
            textAnchor="end"
            interval={0}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Bar
            dataKey={table.headers[activeCol]}
            fill={COLORS[numericCols.indexOf(activeCol) % COLORS.length]}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
