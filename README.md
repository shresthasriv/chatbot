# ChatBridge - AI Chatbot Application

A modern chatbot application built with React, Nhost Auth, Hasura GraphQL, and n8n automation.

## 🚀 Features

- **Authentication**: Email-based sign-up/sign-in with Nhost Auth
- **Real-time Chat**: GraphQL subscriptions for live message updates
- **AI Integration**: Chatbot powered by n8n workflow and OpenRouter API
- **Modern UI**: Beautiful, responsive interface with dark/light themes
- **Secure**: Row-Level Security (RLS) and proper permission controls

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Apollo Client** for GraphQL
- **Nhost React** for authentication
- **Tailwind CSS** for styling
- **Radix UI** for components
- **Zustand** for state management

### Backend
- **Nhost** for authentication and database hosting
- **Hasura** for GraphQL API and permissions
- **PostgreSQL** for data storage
- **n8n** for AI workflow automation
- **OpenRouter** for AI model integration

## 📋 Requirements Met

✅ **Authentication**
- Email-based sign-up/sign-in with Nhost Auth
- Protected routes and features

✅ **GraphQL Only**
- All frontend communication via GraphQL
- No REST API calls

✅ **Real-time Features**
- Live chat updates via GraphQL subscriptions
- Real-time message delivery

✅ **AI Integration**
- Hasura Actions trigger n8n workflows
- AI responses saved to database
- Secure API integration

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```bash
# Nhost Configuration
VITE_NHOST_SUBDOMAIN=your_nhost_subdomain
VITE_NHOST_REGION=your_nhost_region
```


## 📖 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run check

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔒 Security Features

- **Row-Level Security** enforced by Hasura
- **JWT Authentication** with automatic token refresh
- **HTTPS Only** communication
- **Secure headers** configured in Netlify
- **Input validation** on all forms
