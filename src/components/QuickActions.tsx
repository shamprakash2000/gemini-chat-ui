import { Database, Package, ShoppingCart, Star, FileText, Search, BookOpen } from 'lucide-react'

interface Action {
  icon: React.ReactNode
  label: string
  prompt: string
  category: 'db' | 'rag'
}

const ACTIONS: Action[] = [
  {
    icon: <Package size={16} />,
    label: 'All products',
    prompt: 'Show me all products in the database as a table',
    category: 'db',
  },
  {
    icon: <ShoppingCart size={16} />,
    label: 'Recent orders',
    prompt: 'Show the 10 most recent orders as a table',
    category: 'db',
  },
  {
    icon: <Star size={16} />,
    label: 'Top orders',
    prompt: 'What are the top 5 orders by total value? Show as a table.',
    category: 'db',
  },
  {
    icon: <Database size={16} />,
    label: 'DB schema',
    prompt: 'What tables exist in the database and what columns do they have?',
    category: 'db',
  },
  {
    icon: <FileText size={16} />,
    label: 'Product summary',
    prompt: 'Summarize the product catalog — how many products, price range, any notable items?',
    category: 'db',
  },
  {
    icon: <Search size={16} />,
    label: 'List documents',
    prompt: 'List all documents that have been ingested into the knowledge base',
    category: 'rag',
  },
  {
    icon: <BookOpen size={16} />,
    label: 'Ingest example',
    prompt: 'Ingest this document with id "return-policy": Our return policy allows returns within 30 days of purchase for all products in original condition.',
    category: 'rag',
  },
]

interface Props {
  onSelect: (prompt: string) => void
  disabled: boolean
}

export function QuickActions({ onSelect, disabled }: Props) {
  const dbActions = ACTIONS.filter(a => a.category === 'db')
  const ragActions = ACTIONS.filter(a => a.category === 'rag')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Database
        </p>
        <div className="flex flex-col gap-2">
          {dbActions.map(action => (
            <button
              key={action.label}
              onClick={() => onSelect(action.prompt)}
              disabled={disabled}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-transparent hover:border-blue-100"
            >
              <span className="text-gray-400 shrink-0">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Knowledge Base
        </p>
        <div className="flex flex-col gap-2">
          {ragActions.map(action => (
            <button
              key={action.label}
              onClick={() => onSelect(action.prompt)}
              disabled={disabled}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-transparent hover:border-purple-100"
            >
              <span className="text-gray-400 shrink-0">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
