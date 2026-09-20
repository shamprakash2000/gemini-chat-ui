import { useEffect, useState } from 'react'
import { Moon, Sun, X } from 'lucide-react'
import { QuickActions } from './components/QuickActions'
import { ChatPanel } from './components/ChatPanel'
import { useChat } from './hooks/useChat'
import { useDarkMode } from './hooks/useDarkMode'
import { wakeServices } from './lib/api'
import './index.css'

export default function App() {
  const { messages, isLoading, send, clearMessages } = useChat()
  const { dark, toggle } = useDarkMode()
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Wake both Render free-tier services on load. Browser fetch = external traffic,
  // which is the only kind Render responds to for sleeping services.
  useEffect(() => { wakeServices() }, [])

  // Re-ping whenever the last message is an MCP-unavailable error.
  useEffect(() => {
    const last = messages[messages.length - 1]
    if (last?.role === 'agent' && last.content.includes('MCP server is not running')) {
      wakeServices()
    }
  }, [messages])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      if (!e.matches) setSidebarOpen(false)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const sidebarBg = dark ? '#09090b' : '#ffffff'
  const borderColor = dark ? '#27272a' : '#e8e5e0'
  const dividerColor = dark ? '#27272a' : '#f4f4f5'

  const sidebar = (
    <aside
      style={{
        width: 240,
        background: sidebarBg,
        borderRight: `1px solid ${borderColor}`,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        ...(isMobile && {
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          boxShadow: sidebarOpen ? '4px 0 24px rgba(0,0,0,0.12)' : 'none',
        }),
      }}
    >
      {/* Logo row */}
      <div
        style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${dividerColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: dark ? '#27272a' : '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>D</span>
          </div>
          <p style={{ fontSize: 13, fontWeight: 600, color: dark ? '#fafafa' : '#18181b', margin: 0 }}>DataPilot</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={toggle}
            style={{ padding: 4, borderRadius: 6, border: 'none', background: 'transparent', color: dark ? '#71717a' : '#a1a1aa', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title={dark ? 'Switch to light' : 'Switch to dark'}
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{ padding: 4, borderRadius: 6, border: 'none', background: 'transparent', color: dark ? '#71717a' : '#a1a1aa', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        <QuickActions
          onSelect={(prompt) => { send(prompt); setSidebarOpen(false) }}
          disabled={isLoading}
          dark={dark}
        />
      </div>

      {/* Status */}
      <div style={{ padding: '10px 16px', borderTop: `1px solid ${dividerColor}`, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
        <span style={{ fontSize: 10, color: dark ? '#52525b' : '#a1a1aa' }}>MCP connected</span>
      </div>
    </aside>
  )

  return (
    <div style={{ display: 'flex', height: '100dvh', background: dark ? '#09090b' : '#fafaf9', overflow: 'hidden' }}>
      {sidebar}

      {/* Backdrop for mobile drawer */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
        />
      )}

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <ChatPanel
          messages={messages}
          isLoading={isLoading}
          onSend={send}
          onClear={clearMessages}
          dark={dark}
          onMenuClick={isMobile ? () => setSidebarOpen(true) : undefined}
        />
      </main>
    </div>
  )
}
