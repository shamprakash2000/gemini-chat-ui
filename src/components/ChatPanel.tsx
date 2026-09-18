import { useEffect, useRef, useState } from 'react'
import { Trash2, ArrowUp } from 'lucide-react'
import { ChatMessage } from './ChatMessage'
import type { Message } from '../types'

interface Props {
  messages: Message[]
  isLoading: boolean
  onSend: (text: string) => void
  onClear: () => void
  dark: boolean
}

export function ChatPanel({ messages, isLoading, onSend, onClear, dark }: Props) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    onSend(input)
    setInput('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const border = dark ? '#27272a' : '#f4f4f5'
  const bg = dark ? '#09090b' : '#fafaf9'
  const panelBg = dark ? '#09090b' : '#ffffff'
  const titleColor = dark ? '#fafafa' : '#18181b'
  const mutedColor = dark ? '#52525b' : '#a1a1aa'
  const inputBg = dark ? '#18181b' : '#ffffff'
  const inputBorder = dark ? '#3f3f46' : '#e8e5e0'
  const placeholderColor = dark ? '#52525b' : '#d4d4d8'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: bg }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: `1px solid ${border}`,
          background: panelBg,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: titleColor }}>
            AI Data Assistant
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: 10, color: mutedColor }}>
            Ask questions about your database or knowledge base
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={onClear}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 10,
              color: mutedColor,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 5,
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.color = '#ef4444'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.color = mutedColor
            }}
          >
            <Trash2 size={11} />
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {messages.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 10,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: dark ? '#27272a' : '#f4f4f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
              }}
            >
              ◈
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: titleColor }}>
                Ready to help
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: mutedColor }}>
                Ask a question or pick a quick action on the left
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} dark={dark} />
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          padding: '14px 20px',
          borderTop: `1px solid ${border}`,
          background: panelBg,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
            border: `1px solid ${inputBorder}`,
            borderRadius: 10,
            background: inputBg,
            padding: '8px 8px 8px 14px',
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your data..."
            rows={2}
            disabled={isLoading}
            style={{
              flex: 1,
              resize: 'none',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 12,
              color: dark ? '#fafafa' : '#18181b',
              lineHeight: 1.5,
              fontFamily: 'inherit',
              paddingTop: 2,
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            style={{
              width: 32,
              height: 32,
              borderRadius: 7,
              border: 'none',
              background: !input.trim() || isLoading
                ? dark ? '#27272a' : '#f4f4f5'
                : dark ? '#fafafa' : '#18181b',
              color: !input.trim() || isLoading
                ? mutedColor
                : dark ? '#18181b' : '#fafafa',
              cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.15s',
            }}
          >
            {isLoading ? (
              <span
                style={{
                  width: 12,
                  height: 12,
                  border: '1.5px solid',
                  borderColor: `${mutedColor} transparent transparent transparent`,
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
            ) : (
              <ArrowUp size={14} />
            )}
          </button>
        </div>
        <p
          style={{
            margin: '6px 0 0',
            fontSize: 10,
            color: dark ? '#3f3f46' : '#e4e4e7',
            textAlign: 'center',
          }}
        >
          Enter to send · Shift+Enter for new line
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
