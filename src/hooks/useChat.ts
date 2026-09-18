import { useCallback, useRef, useState } from 'react'
import { streamChat } from '../lib/api'
import type { Message } from '../types'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [statusText, setStatusText] = useState('')
  const conversationId = useRef(crypto.randomUUID())

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
    }

    const agentMsgId = crypto.randomUUID()
    const agentMsg: Message = {
      id: agentMsgId,
      role: 'agent',
      content: '',
      status: '',
      isStreaming: true,
    }

    setMessages(prev => [...prev, userMsg, agentMsg])
    setIsLoading(true)
    setStatusText('')

    try {
      for await (const event of streamChat(text.trim(), conversationId.current)) {
        if (event.type === 'status') {
          setStatusText(event.data)
          setMessages(prev =>
            prev.map(m => (m.id === agentMsgId ? { ...m, status: event.data } : m)),
          )
        } else if (event.type === 'token') {
          setStatusText('')
          setMessages(prev =>
            prev.map(m =>
              m.id === agentMsgId
                ? { ...m, content: m.content + event.data, status: '', isStreaming: false }
                : m,
            ),
          )
        } else if (event.type === 'error') {
          setMessages(prev =>
            prev.map(m =>
              m.id === agentMsgId
                ? { ...m, content: `⚠️ ${event.data}`, status: '', isStreaming: false }
                : m,
            ),
          )
        } else if (event.type === 'done') {
          setMessages(prev =>
            prev.map(m =>
              m.id === agentMsgId ? { ...m, isStreaming: false, status: '' } : m,
            ),
          )
        }
      }
    } catch (err) {
      const errorText = err instanceof Error ? err.message : 'Something went wrong'
      setMessages(prev =>
        prev.map(m =>
          m.id === agentMsgId
            ? {
                ...m,
                content: `Error: ${errorText}. Make sure gemini-chat is running on port 8080.`,
                isStreaming: false,
                status: '',
              }
            : m,
        ),
      )
    } finally {
      setIsLoading(false)
      setStatusText('')
    }
  }, [isLoading])

  const clearMessages = useCallback(() => {
    setMessages([])
    conversationId.current = crypto.randomUUID()
  }, [])

  return { messages, isLoading, statusText, send, clearMessages }
}
