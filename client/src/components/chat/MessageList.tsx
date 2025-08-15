import { useEffect, useRef } from 'react'
import { useSubscription } from '@apollo/client'
import { useUserData } from '@nhost/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChatStore } from '@/stores/chatStore'
import { useTheme } from '@/providers/ThemeProvider'
import { MESSAGES_SUBSCRIPTION } from '@/lib/graphql'
import type { Message } from '@shared/schema'

export function MessageList() {
  const user = useUserData()
  const { theme } = useTheme()
  const { activeChat, messages, setMessages, isTyping } = useChatStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Subscribe to messages
  const { data: messagesData } = useSubscription(MESSAGES_SUBSCRIPTION, {
    variables: { chat_id: activeChat },
    skip: !activeChat,
  })

  // Update messages from subscription
  useEffect(() => {
    if (messagesData?.messages) {
      setMessages(messagesData.messages)
    }
  }, [messagesData, setMessages])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-green-400 to-teal-500' 
              : 'bg-gradient-to-r from-teal-500 to-cyan-600'
          }`}>
            <i className="fas fa-robot text-white text-3xl"></i>
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome to AI Chat
          </h3>
          <p className={`${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Select a chat or create a new one to start chatting with AI
          </p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-green-400 to-teal-500' 
                : 'bg-gradient-to-r from-teal-500 to-cyan-600'
            }`}>
              <i className="fas fa-robot text-white text-xl"></i>
            </div>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Start a conversation with the AI assistant
            </p>
          </div>
        ) : (
          messages.map((message: Message) => (
            <div
              key={message.id}
              className={`animate-slide-up ${
                message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
              }`}
            >
              {message.role === 'user' ? (
                <div className="max-w-xs lg:max-w-md">
                  <div className={`p-4 rounded-2xl rounded-br-md ${
                    theme === 'dark'
                      ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white'
                      : 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className="text-right mt-1">
                    <span className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {formatTimestamp(message.created_at)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-3 max-w-xs lg:max-w-md">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-green-400 to-teal-500'
                      : 'bg-gradient-to-r from-teal-500 to-cyan-600'
                  }`}>
                    <i className="fas fa-robot text-white text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <div className={`p-4 rounded-2xl rounded-bl-md ${
                      theme === 'dark'
                        ? 'bg-gray-800/50 text-gray-100 border border-gray-700/30'
                        : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <div className="mt-1">
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {formatTimestamp(message.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex space-x-3 max-w-xs lg:max-w-md">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-green-400 to-teal-500'
                  : 'bg-gradient-to-r from-teal-500 to-cyan-600'
              }`}>
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <div className={`p-4 rounded-2xl rounded-bl-md ${
                theme === 'dark'
                  ? 'bg-gray-800/50 border border-gray-700/30'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}>
                <div className="flex space-x-1">
                  <div className={`w-2 h-2 rounded-full animate-typing ${
                    theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
                  }`}></div>
                  <div className={`w-2 h-2 rounded-full animate-typing ${
                    theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
                  }`} style={{ animationDelay: '0.2s' }}></div>
                  <div className={`w-2 h-2 rounded-full animate-typing ${
                    theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
                  }`} style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
