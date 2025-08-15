import { useEffect } from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import { useUserData, useSignOut } from '@nhost/react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ThemeToggle } from './ThemeToggle'
import { useChatStore } from '@/stores/chatStore'
import { useTheme } from '@/providers/ThemeProvider'
import { useToast } from '@/hooks/use-toast'
import {
  GET_CHATS,
  CREATE_CHAT,
  DELETE_CHAT,
  CHATS_SUBSCRIPTION,
} from '@/lib/graphql'

export function ChatSidebar() {
  const user = useUserData()
  const { signOut } = useSignOut()
  const { theme } = useTheme()
  const { toast } = useToast()
  const { activeChat, chats, setActiveChat, setChats } = useChatStore()

  // Queries and Mutations
  const { data: chatsData, loading: chatsLoading } = useQuery(GET_CHATS, {
    variables: { user_id: user?.id },
    skip: !user?.id,
  })

  const { data: chatsSubData } = useSubscription(CHATS_SUBSCRIPTION, {
    variables: { user_id: user?.id },
    skip: !user?.id,
  })

  const [createChat, { loading: createLoading }] = useMutation(CREATE_CHAT, {
    onCompleted: (data) => {
      setActiveChat(data.insert_chats_one.id)
      toast({
        title: "Success",
        description: "New chat created successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const [deleteChat] = useMutation(DELETE_CHAT, {
    onCompleted: () => {
      toast({
        title: "Success",
        description: "Chat deleted successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  // Update chats from subscription or query
  useEffect(() => {
    const chatData = chatsSubData?.chats || chatsData?.chats
    if (chatData) {
      setChats(chatData)
    }
  }, [chatsData, chatsSubData, setChats])

  const handleCreateNewChat = async () => {
    if (!user?.id) return

    await createChat({
      variables: {
        title: `New Chat ${new Date().toLocaleTimeString()}`,
        user_id: user.id,
      },
    })
  }

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (chatId === activeChat) {
      setActiveChat(null)
    }

    await deleteChat({
      variables: { id: chatId },
    })
  }

  const handleSelectChat = (chatId: string) => {
    setActiveChat(chatId)
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes} min ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className={`w-80 max-w-80 min-w-80 flex flex-col overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gray-900/50 border-gray-700/50' 
        : 'bg-white/80 border-gray-200'
    } backdrop-blur-md border-r`}>
      {/* Header */}
      <div className={`p-4 border-b ${
        theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-green-400 to-teal-500'
                : 'bg-gradient-to-r from-teal-500 to-cyan-600'
            }`}>
              <i className="fas fa-robot text-white text-sm"></i>
            </div>
            <span className={`font-medium truncate max-w-32 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {user?.email || 'Loading...'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className={`p-2 transition-colors duration-200 ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Sign out"
            >
              <i className="fas fa-sign-out-alt"></i>
            </Button>
          </div>
        </div>

        {/* New Chat Button */}
        <Button
          onClick={handleCreateNewChat}
          disabled={createLoading}
          className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-green-600/20 to-teal-600/20 border border-green-500/30 text-green-400 hover:from-green-600/30 hover:to-teal-600/30'
              : 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700 shadow-lg'
          }`}
        >
          {createLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <i className="fas fa-plus"></i>
              <span>New Chat</span>
            </>
          )}
        </Button>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 p-4">
        {chatsLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg animate-pulse ${
                  theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-100'
                }`}
              >
                <div className={`h-4 rounded mb-2 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
                <div className={`h-3 rounded w-3/4 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
              </div>
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-8">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              theme === 'dark' 
                ? 'bg-gray-800/50' 
                : 'bg-gray-100'
            }`}>
              <i className={`fas fa-comments text-2xl ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`}></i>
            </div>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              No chats yet. Create your first chat to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat: any) => (
              <div key={chat.id} className="group">
                <button
                  onClick={() => handleSelectChat(chat.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    activeChat === chat.id
                      ? theme === 'dark'
                        ? 'bg-green-600/20 border border-green-500/30'
                        : 'bg-teal-50 border border-teal-200'
                      : theme === 'dark'
                        ? 'bg-gray-800/30 hover:bg-gray-700/50 border border-transparent hover:border-gray-600/50'
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="grid grid-cols-[1fr_24px] gap-3 items-start w-full">
                    <div className="min-w-0 overflow-hidden">
                      <h3 className={`font-medium truncate text-sm leading-5 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {chat.title}
                      </h3>
                      {chat.messages && chat.messages[0] && (
                        <p className={`text-xs truncate mt-1 leading-4 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`} style={{ maxWidth: '100%' }}>
                          {chat.messages[0].content}
                        </p>
                      )}
                      <span className={`text-xs truncate mt-1 block ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {formatTimestamp(chat.updated_at || chat.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-center items-start pt-1">
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className={`opacity-0 group-hover:opacity-100 transition-all duration-200 w-4 h-4 flex items-center justify-center hover:scale-110 ${
                          theme === 'dark' 
                            ? 'text-gray-400 hover:text-red-400' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
