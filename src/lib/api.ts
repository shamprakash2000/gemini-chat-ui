import type { SseEvent } from '../types'

const API_BASE = 'http://localhost:8080'

// Parse SSE text lines into typed events.
// Spring Boot SSE format:
//   event: status\ndata: Querying database...\n\n
//   event: token\ndata: Here are the products:\n...\n\n
//   data: [DONE]\n\n
function parseSseChunk(chunk: string): SseEvent[] {
  const events: SseEvent[] = []
  const blocks = chunk.split('\n\n').filter(b => b.trim())

  for (const block of blocks) {
    const lines = block.split('\n')
    let eventType = 'unknown'
    let data = ''

    for (const line of lines) {
      if (line.startsWith('event:')) {
        eventType = line.replace('event:', '').trim()
      } else if (line.startsWith('data:')) {
        const chunk = line.replace('data:', '').trim()
        data = data ? data + '\n' + chunk : chunk
      }
    }

    if (data === '[DONE]') {
      events.push({ type: 'done', data: '' })
    } else if (eventType === 'error') {
      events.push({ type: 'error', data })
    } else if (eventType === 'status' || eventType === 'token') {
      events.push({ type: eventType as 'status' | 'token', data })
    }
  }

  return events
}

export async function* streamChat(
  message: string,
  conversationId: string,
): AsyncGenerator<SseEvent> {
  const res = await fetch(`${API_BASE}/api/mcp-agent/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({ message, conversationId }),
  })

  if (!res.ok) {
    throw new Error(`Server error: ${res.status} ${res.statusText}`)
  }

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    // Only process complete SSE blocks (ending with \n\n)
    const lastDouble = buffer.lastIndexOf('\n\n')
    if (lastDouble === -1) continue

    const toProcess = buffer.slice(0, lastDouble + 2)
    buffer = buffer.slice(lastDouble + 2)

    for (const event of parseSseChunk(toProcess)) {
      yield event
    }
  }

  // Process any remaining buffer
  if (buffer.trim()) {
    for (const event of parseSseChunk(buffer)) {
      yield event
    }
  }
}
