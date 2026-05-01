import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api.js'
import Button from './ui/Button.jsx'
import Input from './ui/Input.jsx'
import { Search, Plus } from 'lucide-react'

export default function ChatList({ selectedChatId, onSelectChat }) {
  const [search, setSearch] = useState('')
  const { data: chats = [] } = useQuery({
    queryKey: ['chats'],
    queryFn: () => api.get('/chats').then(r => r.data),
    refetchInterval: 3000,
  })

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-80 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-xl flex flex-col h-screen">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Чаты
          </h2>
          <Link to="/chats/new">
            <Button size="sm" className="flex items-center gap-2">
              <Plus size={18} />
            </Button>
          </Link>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="🔍 Поиск чатов"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-12 pr-4 shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.map(chat => (
          <div
            key={chat.id}
            className={`p-5 cursor-pointer transition-all hover:shadow-md border-b border-gray-50 ${
              selectedChatId === chat.id
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-r-4 border-blue-500 shadow-lg'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-bold text-sm uppercase">{chat.title.slice(0,2)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate text-lg">{chat.title}</p>
                <p className="text-sm text-gray-500 truncate">{chat.last_message?.text?.slice(0, 40) || 'Нет сообщений'}...</p>
              </div>
              {chat.unread_count > 0 && (
                <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg flex-shrink-0">
                  {chat.unread_count > 99 ? '99+' : chat.unread_count}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}