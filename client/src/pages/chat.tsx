import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatMainArea } from '@/components/chat/ChatMainArea'
import { useTheme } from '@/providers/ThemeProvider'

export default function ChatPage() {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen w-full relative ${
      theme === 'dark' ? 'chat-dark-bg' : 'chat-light-bg'
    }`}>
      {/* Background Gradients */}
      {theme === 'dark' ? (
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34, 197, 94, 0.25), transparent 70%), #000000',
          }}
        />
      ) : (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #14b8a6 100%)',
            backgroundSize: '100% 100%',
          }}
        />
      )}

      {/* Chat Layout */}
      <div className="relative z-10 flex h-screen">
        <ChatSidebar />
        <ChatMainArea />
      </div>
    </div>
  )
}
