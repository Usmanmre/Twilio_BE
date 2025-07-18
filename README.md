# Twilio IVR Backend

A NestJS backend application that handles Twilio IVR calls with call forwarding and voicemail functionality.

## Features

- **IVR Menu**: Inbound calls trigger a menu with two options
  - Press 1: Forward call to a personal phone number
  - Press 2: Allow caller to leave a voicemail
- **Call Logging**: All calls are logged in MongoDB with detailed information
- **REST API**: Complete API for managing and viewing call logs
- **Swagger Documentation**: Interactive API documentation
- **Webhook Support**: Handles Twilio webhook events for call status updates

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Twilio account with a phone number

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd twilio-ivr-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/twilio_ivr

# Twilio Configuration
PERSONAL_PHONE_NUMBER=+1234567890

# Application Configuration
PORT=3000
NODE_ENV=development
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

The application will be available at `http://localhost:3000`

## API Documentation

Once the application is running, you can access the Swagger documentation at:
`http://localhost:3000/api`

### Main Endpoints

#### Calls API
- `GET /calls` - Get all calls with pagination
- `GET /calls/:id` - Get a specific call by ID
- `POST /calls` - Create a new call record

#### Twilio Webhooks
- `POST /twilio/incoming` - Handle incoming calls (IVR menu)
- `POST /twilio/gather` - Handle digit input from IVR
- `POST /twilio/status-callback` - Handle call status updates
- `POST /twilio/recording-complete` - Handle voicemail recording completion

## Twilio Configuration

### Webhook URLs
Configure your Twilio phone number with these webhook URLs:

1. **Voice Webhook**: `https://your-domain.com/twilio/incoming`
2. **Status Callback**: `https://your-domain.com/twilio/status-callback`

### IVR Flow
1. Incoming call → `/twilio/incoming` (presents menu)
2. User presses digit → `/twilio/gather` (processes choice)
3. Call status updates → `/twilio/status-callback` (logs status)
4. Voicemail recording → `/twilio/recording-complete` (saves recording)

## Database Schema

### Call Model
```typescript
{
  _id: ObjectId,
  callerNumber: string,
  calledNumber: string,
  twilioCallSid: string,
  status: CallStatus,
  action: CallAction,
  duration: number,
  voicemailUrl: string,
  forwardedTo: string,
  recordingSid: string,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Enums
- **CallStatus**: `ringing`, `in-progress`, `completed`, `failed`, `busy`, `no-answer`, `canceled`
- **CallAction**: `forwarded`, `voicemail`, `hangup`

## Development

### Project Structure
```
src/
├── common/
│   ├── dto/           # Data Transfer Objects
│   ├── entities/      # MongoDB schemas
│   └── interfaces/    # TypeScript interfaces
├── modules/
│   ├── calls/         # Call management module
│   └── twilio/        # Twilio webhook module
├── app.module.ts      # Main application module
└── main.ts           # Application entry point
```

### Available Scripts
- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Deployment

1. Set up MongoDB (local or cloud)
2. Configure environment variables
3. Build the application: `npm run build`
4. Start the application: `npm run start:prod`
5. Configure Twilio webhook URLs to point to your deployed application

## License

This project is licensed under the MIT License. 