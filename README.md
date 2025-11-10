# Vibly Test

An Angular application for session scheduling and booking, integrated with Vibly's GraphQL API.

**Live Demo:** https://vibly-test.elbarae.me

## Tech Stack

- **Angular** 20.3.0
- **Apollo Angular** - GraphQL client
- **Tailwind CSS** - Styling
- **Karma + Jasmine** - Testing framework
- **GraphQL Code Generator** - Type-safe GraphQL operations

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Before running the application, you need to set up your environment files with your API credentials:

1. Copy the example environment files:
```bash
cp src/environments/environment.ts.example src/environments/environment.ts
cp src/environments/environment.prod.ts.example src/environments/environment.prod.ts
```

2. Edit the files and replace the placeholder values with your actual GraphQL endpoint and API key:
   - `graphqlEndpoint` - Your GraphQL API endpoint URL
   - `graphqlApiKey` - Your GraphQL API key

### Date Override

⚠️ **IMPORTANT: This is a hack/patch (flex tape solution) for demo purposes only!**

The application includes a date override in `src/main.ts` that sets the current date to 4 months ago. This is necessary because the API data is limited to July and August. Without this override, the application and tests won't be functional since there would be no available data to display. The date override ensures that the calendar and booking features work correctly with the available API data.

**⚠️ WARNING: This date override should NEVER be used in production under any circumstances.** It is only included here to make the demo functional with the limited test data available. In a real production environment, you should use actual current dates and ensure your API provides data for the relevant time periods.

### Development

```bash
npm start
```

The application will be available at `http://localhost:4200`.

### Build

```bash
npm run build
```

### Testing

```bash
npm test
```

### GraphQL Code Generation

```bash
npm run codegen
```

## Project Structure

- `src/app/features/booking/` - Booking workflow components and pages
- `src/app/components/` - Reusable UI components (calendar, time slot picker, etc.)
- `src/app/graphql/` - GraphQL queries and generated types
- `src/environments/` - Environment configuration

## Features

- 4-step session scheduling workflow
- Calendar-based date selection
- Time slot picker
- Booking confirmation and success pages
- GraphQL API integration with Vibly

