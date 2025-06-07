# Technical Context: Calvin EMR

## Technology Stack

### Frontend

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **State Management**: React Context API
- **Styling**: SCSS with modular architecture
- **HTTP Client**: Custom Axios wrappers
- **Real-time Communication**: Socket.io client
- **Form Handling**: Custom validation with TypeScript

### Backend

- **Runtime**: Node.js with TypeScript
- **API Framework**: Express.js
- **Real-time Communication**: Socket.io server
- **Authentication**: JWT-based authentication
- **External Service Integration**:
  - Xano (Backend-as-a-Service)
  - SRFax (Fax service)
  - Twilio (SMS/Voice)
  - Mailgun (Email)
  - OpenAI (AI capabilities)
  - Weather API

### Database

- **Primary Database**: Xano (Backend-as-a-Service with built-in database)
- **Data Access**: RESTful API calls to Xano endpoints

### DevOps

- **Version Control**: Git
- **Package Management**: pnpm
- **Deployment**: Likely Heroku (based on Procfile)
- **Environment Management**: Environment variables

## Development Environment

### Prerequisites

- Node.js (LTS version)
- pnpm package manager
- Git
- Modern web browser (Chrome/Firefox/Safari)
- Code editor (VSCode recommended)

### Project Structure

```
calvinemr-fullstack/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── api/            # API integration
│   │   ├── assets/         # Assets (images, fonts)
│   │   ├── components/     # React components
│   │   ├── context/        # Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── omdDatas/       # Data definitions
│   │   ├── pages/          # Page components
│   │   ├── socketHandlers/ # Socket.io event handlers
│   │   ├── styles/         # SCSS styles
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   ├── validation/     # Form validation
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Entry point
│   ├── index.html          # HTML template
│   ├── tsconfig.json       # TypeScript configuration
│   └── vite.config.ts      # Vite configuration
├── server/                 # Backend Node.js application
│   ├── src/                # Source code
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Entry point
│   └── tsconfig.json       # TypeScript configuration
├── package.json            # Root package.json
└── Procfile                # Heroku deployment configuration
```

### Setup and Installation

1. Clone the repository
2. Install dependencies with `pnpm install` (both root and in client/server directories)
3. Set up environment variables
4. Start development servers:
   - Frontend: `pnpm run dev` in client directory
   - Backend: `pnpm run dev` in server directory

## Technical Constraints

### Performance Requirements

- **Response Time**: UI interactions should feel immediate (<100ms)
- **Page Load**: Initial page load under 2 seconds
- **API Response**: Backend API responses under 500ms
- **Concurrent Users**: Support for multiple simultaneous users per clinic

### Security Requirements

- **Data Protection**: All PHI (Protected Health Information) must be secured
- **Authentication**: Secure, token-based authentication
- **Authorization**: Role-based access control
- **Session Management**: Automatic session timeout and screen locking
- **Audit Trail**: Logging of sensitive operations

### Compliance Requirements

- **HIPAA Compliance**: Required for handling medical records in the US
- **Data Retention**: Policies for data storage and deletion
- **Accessibility**: WCAG 2.1 AA compliance

### Browser Support

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Mobile browser support for responsive views
- No support required for IE11 or older browsers

## Dependencies and Integrations

### Key Frontend Dependencies

- React
- TypeScript
- Socket.io-client
- SCSS
- Axios

### Key Backend Dependencies

- Node.js
- Express
- TypeScript
- Socket.io
- Axios (for external API calls)

### External Service Integrations

1. **Xano**

   - Primary backend-as-a-service
   - Database and authentication
   - Custom API endpoints

2. **SRFax**

   - Fax sending and receiving
   - Fax to email conversion
   - Fax status tracking

3. **Twilio**

   - SMS notifications
   - Voice capabilities
   - Two-factor authentication

4. **Mailgun**

   - Transactional emails
   - Email templates
   - Email delivery tracking

5. **OpenAI**

   - Natural language processing
   - Clinical documentation assistance
   - Data extraction from unstructured text

6. **Weather API**
   - Weather information integration
   - Location-based forecasts

## Technical Debt and Considerations

### Known Technical Debt

- Identify any existing technical debt as it's discovered
- Document workarounds that need proper solutions

### Future Technical Considerations

- Mobile application development
- Offline-first capabilities
- Enhanced real-time collaboration features
- Integration with additional healthcare systems
- AI-assisted clinical documentation

This technical context document serves as a reference for understanding the technology stack, development environment, and technical constraints of the Calvin EMR system. It should be consulted when making technical decisions to ensure consistency with the established architecture.
