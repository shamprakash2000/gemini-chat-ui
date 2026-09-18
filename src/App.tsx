import { Moon, Sun } from 'lucide-react'
import { QuickActions } from './components/QuickActions'
import { ChatPanel } from './components/ChatPanel'
import { useChat } from './hooks/useChat'
import { useDarkMode } from './hooks/useDarkMode'
import './index.css'

export default function App() {
  const { messages, isLoading, send, clearMessages } = useChat()
  const { dark, toggle } = useDarkMode()

  return (
    <div className="flex h-screen" style={{ background: dark ? '#09090b' : '#fafaf9' }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col shrink-0"
        style={{
          width: 220,
          background: dark ? '#09090b' : '#ffffff',
          borderRight: `1px solid ${dark ? '#27272a' : '#e8e5e0'}`,
        }}
      >
        {/* Logo row */}
        <div
          className="flex items-center justify-between"
          style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${dark ? '#27272a' : '#f4f4f5'}` }}
        >
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: dark ? '#27272a' : '#18181b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>G</span>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: dark ? '#fafafa' : '#18181b', margin: 0 }}>
                gemini-chat
              </p>
            </div>
          </div>
          <button
            onClick={toggle}
            style={{
              padding: '4px',
              borderRadius: 6,
              border: 'none',
              background: 'transparent',
              color: dark ? '#71717a' : '#a1a1aa',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title={dark ? 'Switch to light' : 'Switch to dark'}
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {/* Quick actions */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '8px 0' }}>
          <QuickActions onSelect={send} disabled={isLoading} dark={dark} />
        </div>

        {/* Status */}
        <div
          style={{
            padding: '10px 16px',
            borderTop: `1px solid ${dark ? '#27272a' : '#f4f4f5'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: 10, color: dark ? '#52525b' : '#a1a1aa' }}>MCP connected</span>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <ChatPanel
          messages={messages}
          isLoading={isLoading}
          onSend={send}
          onClear={clearMessages}
          dark={dark}
        />
      </main>
    </div>
  )
}
