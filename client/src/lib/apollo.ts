import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context'
import { createClient } from 'graphql-ws'
import { nhost } from './nhost'

// HTTP Link for queries and mutations
const httpLink = createHttpLink({
  uri: `https://${import.meta.env.VITE_NHOST_SUBDOMAIN || 'thunpfudsbublhllnhrt'}.hasura.${import.meta.env.VITE_NHOST_REGION || 'ap-south-1'}.nhost.run/v1/graphql`,
})

// WebSocket Link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: `wss://${import.meta.env.VITE_NHOST_SUBDOMAIN || 'thunpfudsbublhllnhrt'}.hasura.${import.meta.env.VITE_NHOST_REGION || 'ap-south-1'}.nhost.run/v1/graphql`,
    connectionParams: () => ({
      headers: {
        authorization: `Bearer ${nhost.auth.getAccessToken()}`,
      },
    }),
  })
)

// Auth Link
const authLink = setContext((_, { headers }) => {
  const token = nhost.auth.getAccessToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// Split Link
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  errorPolicy: 'all',
})
