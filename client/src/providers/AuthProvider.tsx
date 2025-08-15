import { NhostProvider } from '@nhost/react'
import { ApolloProvider } from '@apollo/client'
import { nhost } from '@/lib/nhost'
import { apolloClient } from '@/lib/apollo'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <NhostProvider nhost={nhost}>
      <ApolloProvider client={apolloClient}>
        {children}
      </ApolloProvider>
    </NhostProvider>
  )
}
