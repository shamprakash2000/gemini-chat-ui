import { QuickActions } from './components/QuickActions'
import { ChatPanel } from './components/ChatPanel'
import { useChat } from './hooks/useChat'
import './index.css'

export default function App() {
  const { messages, isLoading, send, clearMessages } = useChat()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">G</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">gemini-chat</p>
              <p className="text-xs text-gray-400">MCP Agent</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <QuickActions onSelect={send} disabled={isLoading} />
        </div>

        <div className="px-5 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-400">
              gemini-knowledge-mcp-server
            </span>
          </div>
        </div>
      </aside>

      {/* Main chat area */}
      <main className="flex-1 min-w-0">
        <ChatPanel
          messages={messages}
          isLoading={isLoading}
          onSend={send}
          onClear={clearMessages}
        />
      </main>
    </div>
  )
}
