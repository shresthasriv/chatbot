import { useState, useRef, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { useUserData } from '@nhost/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useChatStore } from '@/stores/chatStore'
import { useTheme } from '@/providers/ThemeProvider'
import { useToast } from '@/hooks/use-toast'
import { INSERT_MESSAGE, SEND_MESSAGE_ACTION } from '@/lib/graphql'

export function MessageInput() {
  const [content, setContent] = useState('')
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const user = useUserData()
  const { theme } = useTheme()
  const { toast } = useToast()
  const { activeChat, setTyping } = useChatStore()

  const [insertMessage] = useMutation(INSERT_MESSAGE)
  const [sendMessageAction, { loading: sendingMessage }] = useMutation(SEND_MESSAGE_ACTION)

  const MAX_CHARS = 2000

  useEffect(() => {
    setCharCount(content.length)
  }, [content])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim() || !activeChat || !user?.id) return

    if (content.length > MAX_CHARS) {
      toast({
        title: "Error",
        description: `Message is too long. Maximum ${MAX_CHARS} characters allowed.`,
        variant: "destructive"
      })
      return
    }

    const messageContent = content.trim()
    setContent('')
    setCharCount(0)

    try {
      // Insert user message
      await insertMessage({
        variables: {
          chat_id: activeChat,
          content: messageContent,
          role: 'user',
          user_id: user.id,
        },
      })

      // Show typing indicator
      setTyping(true)

      // Send to AI via Hasura Action
      const aiResponse = await sendMessageAction({
        variables: {
          chat_id: activeChat,
          content: messageContent,
        },
      })

      setTyping(false)

      // Handle AI response - insert the AI message if we got a successful response
      if (aiResponse.data?.sendMessage?.success && aiResponse.data?.sendMessage?.content) {
        await insertMessage({
          variables: {
            chat_id: activeChat,
            content: aiResponse.data.sendMessage.content,
            role: 'assistant',
            user_id: user.id,
          },
        })
      } else if (aiResponse.data?.sendMessage?.error) {
        throw new Error(aiResponse.data.sendMessage.error)
      }
    } catch (error: any) {
      setTyping(false)
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive"
      })
      // Restore the message if it failed
      setContent(messageContent)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= MAX_CHARS) {
      setContent(value)
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [content])

  if (!activeChat) return null

  return (
    <div className={`p-4 border-t backdrop-blur-md ${
      theme === 'dark'
        ? 'border-gray-700/50 bg-gray-900/30'
        : 'border-gray-200 bg-white/70'
    }`}>
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={`w-full p-4 rounded-2xl resize-none transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:ring-green-400'
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-teal-500 shadow-sm'
            }`}
            placeholder="Type your message..."
            disabled={sendingMessage}
            rows={2}
          />
          
          {/* Character Counter */}
          <div className={`absolute bottom-2 right-2 text-xs ${
            charCount > MAX_CHARS * 0.9 
              ? 'text-red-500' 
              : theme === 'dark' 
                ? 'text-gray-500' 
                : 'text-gray-400'
          }`}>
            {charCount}/{MAX_CHARS}
          </div>
        </div>

        <Button
          type="submit"
          disabled={!content.trim() || sendingMessage || charCount > MAX_CHARS}
          className={`p-4 rounded-2xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 focus:ring-green-400 focus:ring-offset-black'
              : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 focus:ring-teal-500 focus:ring-offset-white shadow-lg'
          } text-white`}
          title="Send message"
        >
          {sendingMessage ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <i className="fas fa-paper-plane"></i>
          )}
        </Button>
      </form>

      {/* Quick Actions */}
      <div className="flex items-center space-x-4 mt-3">
        <button
          type="button"
          className={`transition-colors duration-200 ${
            theme === 'dark' 
              ? 'text-gray-400 hover:text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          title="Attach file (Coming soon)"
          disabled
        >
          <i className="fas fa-paperclip"></i>
        </button>
        <button
          type="button"
          className={`transition-colors duration-200 ${
            theme === 'dark' 
              ? 'text-gray-400 hover:text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          title="Add emoji (Coming soon)"
          disabled
        >
          <i className="fas fa-smile"></i>
        </button>
        <div className="flex-1"></div>
        <span className={`text-xs ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          Press Shift+Enter for new line
        </span>
      </div>
    </div>
  )
}
