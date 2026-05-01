import { useState, useEffect } from 'react'
import { useParams, Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api.js'
import ChatList from '../components/ChatList.jsx'
import ChatWindow from '../components/ChatWindow.jsx'

export default function ChatsLayout() {
  const [selectedChatId, setSelectedChatId] = useState(null)
  const { id } = useParams()

  const { data: chats = [] } = useQuery({
    queryKey: ['chats'],
    queryFn: () => api.get('/chats').then(res => res.data),
    refetchInterval: 5000,
  })

  const selectedChat = chats.find(chat => chat.id === (id || selectedChatId))

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <ChatList
        chats={chats}
        selectedChatId={id || selectedChatId}
        onSelectChat={setSelectedChatId}
      />
      <Outlet context={{ selectedChat }} />
    </div>
  )
}