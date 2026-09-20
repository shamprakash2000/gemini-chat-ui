import { useState, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Sparkles } from 'lucide-react'
import type { Message } from '../types'
import { parseMarkdownTable, getNumericColumns } from '../lib/parseTable'
import { TableChart } from './TableChart'

const STATUS_PHRASES = [
  'Thinking it through...',
  'On it...',
  'Looking that up...',
  'Working on it...',
  'Fetching your data...',
  'Let me check...',
  'Reasoning through this...',
  'Digging in...',
  'Give me a moment...',
  'Consulting the sources...',
  'Pulling the data...',
  'Almost there...',
]

interface Props {
  message: Message
  dark: boolean
}

// Extract ```sql ... ``` block and return [sql string, content without the block + its label]
function extractSql(content: string): { sql: string | null; rest: string } {
  const sqlBlockRe = /SQL_EXECUTED:\s*\n```sql\n([\s\S]*?)```/
  const match = content.match(sqlBlockRe)
  if (match) {
    return {
      sql: match[1].trim(),
      rest: content.replace(sqlBlockRe, '').trim(),
    }
  }
  // fallback: bare ```sql block without the label
  const bareRe = /```sql\n([\s\S]*?)```/
  const bare = content.match(bareRe)
  if (bare) {
    return {
      sql: bare[1].trim(),
      rest: content.replace(bareRe, '').trim(),
    }
  }
  return { sql: null, rest: content }
}

export function ChatMessage({ message, dark }: Props) {
  const isUser = message.role === 'user'
  const [showChart, setShowChart] = useState(false)

  const { sql, rest } = !isUser ? extractSql(message.content) : { sql: null, rest: message.content }

  const table = !isUser ? parseMarkdownTable(message.content) : null
  const hasChart = table !== null && getNumericColumns(table).length > 0

  const statusPhrase = useMemo(() => {
    const idx = message.id.charCodeAt(0) % STATUS_PHRASES.length
    return STATUS_PHRASES[idx]
  }, [message.id])

  const userBubbleBg = dark ? '#374151' : '#e5e7eb'
  const userBubbleText = dark ? '#f9fafb' : '#111827'
  const aiText = dark ? '#d4d4d8' : '#27272a'
  const metaColor = dark ? '#52525b' : '#a1a1aa'
  const ringColor = dark ? '#8b5cf6' : '#8b5cf6'
  const bounceDot = dark ? '#52525b' : '#d4d4d8'
  const toggleActiveBg = dark ? '#3f3f46' : '#18181b'
  const toggleInactiveBg = dark ? '#27272a' : '#f4f4f5'
  const toggleInactiveText = dark ? '#71717a' : '#a1a1aa'
  const codeBorder = dark ? '#3f3f46' : '#e4e4e7'
  const sqlLabelColor = dark ? '#52525b' : '#a1a1aa'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 16,
      }}
    >
      <div
        style={{
          maxWidth: showChart ? '100%' : isUser ? '72%' : '88%',
          width: showChart ? '100%' : undefined,
          background: isUser ? userBubbleBg : 'transparent',
          color: isUser ? userBubbleText : aiText,
          borderRadius: isUser ? '10px 10px 2px 10px' : 0,
          border: 'none',
          padding: isUser ? '8px 12px' : '0',
          fontSize: 12,
          lineHeight: 1.6,
        }}
      >
        {/* Status indicator */}
        {message.status && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: aiText, marginBottom: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', border: `1.5px solid ${ringColor}`, display: 'inline-block', flexShrink: 0, animation: 'ringPulse 1.5s ease-in-out infinite' }} />
            {statusPhrase}
          </div>
        )}

        {/* Typing dots */}
        {message.isStreaming && !message.status && !message.content && (
          <div style={{ display: 'flex', gap: 4, padding: '4px 0' }}>
            {[0, 150, 300].map(delay => (
              <span key={delay} style={{ width: 6, height: 6, borderRadius: '50%', background: bounceDot, display: 'inline-block', animation: `bounce 1s ease-in-out ${delay}ms infinite` }} />
            ))}
          </div>
        )}

        {message.content && (
          isUser ? (
            <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 12 }}>{message.content}</p>
          ) : (
            <>
              {/* SQL block — always shown regardless of Table/Chart mode */}
              {sql && (
                <div style={{ margin: '0 0 10px', borderRadius: 6, overflow: 'hidden', border: `1px solid ${codeBorder}`, position: 'relative' }}>
                  <span style={{ position: 'absolute', top: 7, right: 10, fontSize: 9, fontWeight: 600, fontFamily: 'monospace', color: sqlLabelColor, letterSpacing: '0.5px', textTransform: 'uppercase', zIndex: 1 }}>
                    sql
                  </span>
                  <SyntaxHighlighter
                    style={dark ? oneDark : oneLight}
                    language="sql"
                    PreTag="div"
                    customStyle={{ margin: 0, borderRadius: 0, fontSize: '11px', background: dark ? '#18181b' : '#fafafa' }}
                  >
                    {sql}
                  </SyntaxHighlighter>
                </div>
              )}

              {/* Table / Chart toggle */}
              {hasChart && (
                <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                  {(['Table', 'Chart'] as const).map(label => {
                    const selected = label === 'Table' ? !showChart : showChart
                    return (
                      <button
                        key={label}
                        onClick={() => setShowChart(label === 'Chart')}
                        style={{ padding: '2px 10px', borderRadius: 20, border: 'none', fontSize: 10, fontWeight: 500, cursor: 'pointer', background: selected ? toggleActiveBg : toggleInactiveBg, color: selected ? '#ffffff' : toggleInactiveText, transition: 'background 0.1s' }}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Table or Chart */}
              {showChart && table ? (
                <TableChart table={table} />
              ) : (
                <div className={`prose prose-sm max-w-none ${dark ? 'prose-invert' : ''}`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p({ children }) {
                        const text = typeof children === 'string' ? children : ''
                        if (text.trim() === 'SQL_EXECUTED:') return null
                        return <p>{children}</p>
                      },
                      code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        const isBlock = !props.ref && (match || String(children).includes('\n'))
                        if (isBlock) {
                          const lang = match?.[1] ?? 'text'
                          // SQL was already extracted and rendered above — skip it here
                          if (lang === 'sql') return null
                          return (
                            <div style={{ margin: '8px 0', borderRadius: 6, overflow: 'hidden', border: `1px solid ${codeBorder}`, position: 'relative' }}>
                              <SyntaxHighlighter
                                style={dark ? oneDark : oneLight}
                                language={lang}
                                PreTag="div"
                                customStyle={{ margin: 0, borderRadius: 0, fontSize: '11px', background: dark ? '#18181b' : '#fafafa' }}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            </div>
                          )
                        }
                        return (
                          <code style={{ background: dark ? '#27272a' : '#f4f4f5', padding: '1px 4px', borderRadius: 3, fontSize: '0.85em', fontFamily: 'monospace', color: dark ? '#d4d4d8' : '#3f3f46' }} {...props}>
                            {children}
                          </code>
                        )
                      },
                    }}
                  >
                    {rest}
                  </ReactMarkdown>
                </div>
              )}
            </>
          )
        )}
      </div>

      {isUser ? (
        <p style={{ margin: '3px 2px 0', fontSize: 9, color: metaColor }}>you</p>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '4px 2px 0', color: dark ? '#7c3aed' : '#7c3aed' }}>
          <Sparkles size={10} />
          <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.3px' }}>assistant</span>
        </div>
      )}

      <style>{`
        @keyframes ringPulse { 0%,100%{border-color:#8b5cf6;transform:scale(1);opacity:1} 50%{border-color:#c4b5fd;transform:scale(1.3);opacity:.7} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      `}</style>
    </div>
  )
}
