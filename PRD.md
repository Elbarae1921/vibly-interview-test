# PRD: Vibly GraphQL Integration

**Product:** Vibly Platform
**Feature:** GraphQL API Integration for 4-Step Session Scheduling Workflow
**Version:** 1.0
**Date:** 2025-11-09

---

## Purpose

Define the requirements for integrating Vibly's GraphQL API into the Angular session scheduling workflow. This PRD will serve as a reference for developers and Cursor IDE to generate queries, types, and client logic.

---

## API Overview

**Base URL:** `YOUR_GRAPHQL_ENDPOINT`

**API Key:** `YOUR_GRAPHQL_API_KEY`

**Required Header:**

```json
{ "x-api-key": "YOUR_GRAPHQL_API_KEY" }
```

**Client:** Apollo Angular

---

## Queries

### 1. Get Session Page

**Purpose:** Retrieve session metadata, host, user, service details.

**Query:**

```graphql
query GetSessionPage($id: ID!) {
  getSessionPage(id: $id) {
    date
    time
    duration
    host {
      firstName
      lastName
      photo
      profession
    }
    user {
      firstName
      lastName
      email
      timeZone
    }
    service {
      title
    }
  }
}
```

**Response Example:**

```json
{
  "data": {
    "getSessionPage": {
      "date": "2025-08-08",
      "time": "10:00:00",
      "duration": 30,
      "host": {
        "firstName": "Jane",
        "lastName": "Doe",
        "photo": "https://example.com/jane.jpg",
        "profession": "Leadership Coach"
      },
      "user": {
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@vibly.io",
        "timeZone": "Europe/Athens"
      },
      "service": {
        "title": "Coaching Session"
      }
    }
  }
}
```

### 2. Get Available Date Times

**Purpose:** Retrieve all available dates and times for a user.

**Query:**

```graphql
query GetAvailableDateTimes($userId: ID!) {
  getAvailableDateTimes(userId: $userId) {
    date
    times {
      start
      end
    }
  }
}
```

**Response Example:**

```json
{
  "data": {
    "getAvailableDateTimes": [
      {
        "date": "2025-08-04",
        "times": [
          { "start": "10:00:00", "end": "12:00:00" },
          { "start": "13:00:00", "end": "16:00:00" }
        ]
      },
      {
        "date": "2025-08-05",
        "times": [
          { "start": "09:00:00", "end": "12:00:00" },
          { "start": "14:00:00", "end": "17:00:00" }
        ]
      }
    ]
  }
}
```

---

## TypeScript Models

```ts
export interface SessionHost {
  photo: string;
  firstName: string;
  lastName: string;
  profession: string;
}

export interface SessionUser {
  email: string;
  firstName: string;
  lastName: string;
  timeZone: string;
}

export interface SessionService {
  title: string;
}

export interface SessionPage {
  date: string;
  time: string;
  duration: number;
  host: SessionHost;
  user: SessionUser;
  service: SessionService;
}

export interface TimeRange {
  start: string;
  end: string;
}

export interface DateAvailability {
  date: string;
  times: TimeRange[];
}
```

---

## Implementation Notes

* Use Apollo Angular to fetch queries.
* Handle loading, error, and empty states for both queries.
* Persist the fetched `SessionPage` and `DateAvailability` in a signal-based state service.
* Use TypeScript interfaces for type-safe consumption of GraphQL data.
* Ensure API key is passed in headers for all requests.

---

## Cursor Instructions

* Generate GraphQL service for Angular using Apollo client.
* Provide functions: `getSessionPage(id: string)` and `getAvailableDateTimes(userId: string)`.
* Generate TypeScript models automatically from schema above.
* Include error handling and loading states in service.
* Connect signals in `BookingStateService` to store results for UI consumption.
