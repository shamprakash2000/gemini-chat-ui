import { Database, Package, ShoppingCart, Star, FileText, Search, BookOpen } from 'lucide-react'
import { useState } from 'react'

interface Action {
  icon: React.ReactNode
  label: string
  prompt: string
  category: 'db' | 'rag'
}

const ACTIONS: Action[] = [
  {
    icon: <Package size={11} />,
    label: 'All products',
    prompt: 'Show me all products in the database as a table',
    category: 'db',
  },
  {
    icon: <ShoppingCart size={11} />,
    label: 'Recent orders',
    prompt: 'Show the 10 most recent orders as a table',
    category: 'db',
  },
  {
    icon: <Star size={11} />,
    label: 'Top orders',
    prompt: 'What are the top 5 orders by total value? Show as a table.',
    category: 'db',
  },
  {
    icon: <Database size={11} />,
    label: 'DB schema',
    prompt: 'What tables exist in the database and what columns do they have?',
    category: 'db',
  },
  {
    icon: <FileText size={11} />,
    label: 'Product summary',
    prompt: 'Summarize the product catalog — how many products, price range, any notable items?',
    category: 'db',
  },
  {
    icon: <Search size={11} />,
    label: 'List documents',
    prompt: 'List all documents that have been ingested into the knowledge base',
    category: 'rag',
  },
  {
    icon: <BookOpen size={11} />,
    label: 'Ask return policy',
    prompt: 'What is the return policy? How many days do I have to return a product?',
    category: 'rag',
  },
]

interface Props {
  onSelect: (prompt: string) => void
  disabled: boolean
  dark: boolean
}

export function QuickActions({ onSelect, disabled, dark }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const dbActions = ACTIONS.filter(a => a.category === 'db')
  const ragActions = ACTIONS.filter(a => a.category === 'rag')

  const handleClick = (action: Action) => {
    if (disabled) return
    setActive(action.label)
    onSelect(action.prompt)
    setTimeout(() => setActive(null), 1200)
  }

  const sectionLabel = (text: string) => (
    <p
      style={{
        fontSize: 9,
        fontWeight: 600,
        color: dark ? '#52525b' : '#a1a1aa',
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        margin: 0,
        padding: '8px 16px 4px',
      }}
    >
      {text}
    </p>
  )

  const renderAction = (action: Action) => {
    const isActive = active === action.label
    const isDb = action.category === 'db'
    const iconBg = isDb
      ? dark ? '#172554' : '#dbeafe'
      : dark ? '#500724' : '#fce7f3'
    const iconColor = isDb
      ? dark ? '#60a5fa' : '#3b82f6'
      : dark ? '#f9a8d4' : '#ec4899'
    const hoverBg = dark ? '#27272a' : '#f4f4f5'
    const textColor = dark ? '#d4d4d8' : '#52525b'
    const activeText = dark ? '#fafafa' : '#18181b'

    return (
      <button
        key={action.label}
        onClick={() => handleClick(action)}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          textAlign: 'left',
          padding: '5px 16px',
          fontSize: 11,
          color: isActive ? activeText : textColor,
          background: isActive ? hoverBg : 'transparent',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.4 : 1,
          transition: 'background 0.1s, color 0.1s',
        }}
        onMouseEnter={e => {
          if (!disabled) (e.currentTarget as HTMLElement).style.background = hoverBg
          if (!disabled) (e.currentTarget as HTMLElement).style.color = activeText
        }}
        onMouseLeave={e => {
          if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
          if (!isActive) (e.currentTarget as HTMLElement).style.color = textColor
        }}
      >
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 4,
            background: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
            flexShrink: 0,
          }}
        >
          {action.icon}
        </span>
        {action.label}
      </button>
    )
  }

  return (
    <>
      {sectionLabel('Database')}
      {dbActions.map(renderAction)}
      {sectionLabel('Knowledge')}
      {ragActions.map(renderAction)}
    </>
  )
}
