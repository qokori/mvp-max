import { useState, useEffect, useRef } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import api from '../services/api.js'
import useAuthStore from '../store/authStore.js'
import { useDropzone } from 'react-dropzone'
import Button from './ui/Button.jsx'
import Input from './ui/Input.jsx'
import { Send, Upload, MessageCircle } from 'lucide-react'

export default function ChatWindow({ chat }) {
  const [newMessage, setNewMessage] = useState('')
  const [files, setFiles] = useState([])
  const messagesEndRef = useRef(null)
  const { id } = useParams()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['messages', id],
    queryFn: ({ pageParam = 1 }) => api.get(`/chats/${id}/messages?page=${pageParam}`).then(r => r.data),
    getNextPageParam: (lastPage) => lastPage.next ? lastPage.next : undefined,
    refetchInterval: 3000,
  })

  const messages = data?.pages.flatMap(page => page.messages) || []

  const sendMutation = useMutation({
    mutationFn: async (messageData) => {
      const formData = new FormData()
      formData.append('text', messageData.text)
      if (messageData.file) formData.append('file', messageData.file)
      return api.post(`/chats/${id}/messages`, formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', id])
      setNewMessage('')
      setFiles([])
    },
  })

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => setFiles(acceptedFiles),
    multiple: false,
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView()
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim() && !files[0]) return
    sendMutation.mutate({ text: newMessage, file: files[0] })
  }

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <MessageCircle className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">Выберите чат</h3>
          <p className="text-gray-500 text-lg">Начните общение с друзьями</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 bg-white border-b-lg shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">{chat.title}</h1>
          <p className="text-gray-500">{chat.type === 'group' ? 'Групповой чат' : 'Личное сообщение'}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-gray-50/70 to-white">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : ''}`}>
            <div className={`max-w-2xl p-4 rounded-2xl shadow-lg ${
              msg.sender_id === user?.id
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                : 'bg-white border'
            }`}>
              <p className="mb-1">{msg.text}</p>
              <p className={`text-xs opacity-75 ${msg.sender_id === user?.id ? 'text-blue-100' : 'text-gray-500'}`}>
                {new Date(msg.created_at).toLocaleString('ru')}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-end space-x-4">
          <div {...getRootProps()} className="p-4 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-400 cursor-pointer transition-colors">
            <input {...getInputProps()} />
            <Upload className="w-6 h-6 mx-auto text-gray-400" />
          </div>

          <Input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder="Напишите сообщение..."
            className="flex-1"
            disabled={sendMutation.isPending}
          />

          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() && !files[0] || sendMutation.isPending}
            className="w-14 h-14 flex items-center justify-center"
          >
            <Send className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}