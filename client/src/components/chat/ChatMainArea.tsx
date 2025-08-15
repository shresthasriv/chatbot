import { useQuery } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { useChatStore } from '@/stores/chatStore'
import { useTheme } from '@/providers/ThemeProvider'
import { GET_MESSAGES } from '@/lib/graphql'

export function ChatMainArea() {
  const { theme } = useTheme()
  const { activeChat, chats, setMessages } = useChatStore()

  // Get active chat details
  const activeChats = chats.find(chat => chat.id === activeChat)

  // Load messages for active chat
  const { loading: messagesLoading } = useQuery(GET_MESSAGES, {
    variables: { chat_id: activeChat },
    skip: !activeChat,
    onCompleted: (data) => {
      setMessages(data.messages || [])
    },
  })

  const handleClearChat = () => {
    // TODO: Implement clear chat functionality
    console.log('Clear chat clicked')
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      {activeChat && (
        <div className={`p-4 border-b backdrop-blur-md ${
          theme === 'dark'
            ? 'border-gray-700/50 bg-gray-900/30'
            : 'border-gray-200 bg-white/70'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-green-400 to-teal-500'
                  : 'bg-gradient-to-r from-teal-500 to-cyan-600'
              }`}>
                <i className="fas fa-robot text-white"></i>
              </div>
              <div>
                <h2 className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {activeChats?.title || 'AI Assistant'}
                </h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full animate-pulse-soft ${
                    theme === 'dark' ? 'bg-green-400' : 'bg-teal-500'
                  }`}></div>
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    AI Assistant Online
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className={`transition-colors duration-200 ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Clear chat history"
            >
              <i className="fas fa-broom"></i>
            </Button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      {messagesLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse-soft ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-green-400 to-teal-500'
                : 'bg-gradient-to-r from-teal-500 to-cyan-600'
            }`}>
              <i className="fas fa-robot text-white text-2xl"></i>
            </div>
            <p className={`text-lg font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Loading messages...
            </p>
          </div>
        </div>
      ) : (
        <MessageList />
      )}

      {/* Message Input */}
      <MessageInput />
    </div>
  )
}
