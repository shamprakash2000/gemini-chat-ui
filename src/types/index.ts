export interface Message {
  id: string
  role: 'user' | 'agent'
  content: string
  status?: string
  isStreaming?: boolean
}

export interface SseEvent {
  type: 'status' | 'token' | 'done' | 'unknown'
  data: string
}
