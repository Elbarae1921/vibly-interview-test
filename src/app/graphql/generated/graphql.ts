import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `AWSTime` scalar type provided by AWS AppSync, represents a valid ***extended*** [ISO 8601 Time](https://en.wikipedia.org/wiki/ISO_8601#Times) string. In other words, this scalar type accepts time strings of the form `hh:mm:ss.SSS`.  The field after the two digit seconds field is a nanoseconds field. It can accept between 1 and 9 digits. So, for example, "**12:00:00.2**", "**12:00:00.277**" and "**12:00:00.123456789**" are all valid time strings. The seconds and nanoseconds fields are optional (the seconds field must be specified if the nanoseconds field is to be used).  This scalar type can also accept an optional [time zone offset](https://en.wikipedia.org/wiki/ISO_8601#Time_zone_designators). For example, "**12:30**", "**12:30Z**", "**12:30:24-07:00**" and "**12:30:24.500+05:30**" are all valid time strings. The time zone offset must either be `Z` (representing the UTC time zone) or be in the format `±hh:mm:ss`. The seconds field in the timezone offset will be considered valid even though it is not part of the ISO 8601 standard. */
  AWSTime: { input: string; output: string; }
};

export type DateAvailability = {
  __typename?: 'DateAvailability';
  date: Scalars['String']['output'];
  times?: Maybe<Array<TimeRange>>;
};

export type Query = {
  __typename?: 'Query';
  getAvailableDateTimes: Array<DateAvailability>;
  getSessionPage: SessionPage;
};


export type QueryGetAvailableDateTimesArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetSessionPageArgs = {
  id: Scalars['ID']['input'];
};

export type SessionHost = {
  __typename?: 'SessionHost';
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  photo?: Maybe<Scalars['String']['output']>;
  profession?: Maybe<Scalars['String']['output']>;
};

export type SessionPage = {
  __typename?: 'SessionPage';
  date?: Maybe<Scalars['String']['output']>;
  duration: Scalars['Int']['output'];
  host: SessionHost;
  service: SessionService;
  time?: Maybe<Scalars['String']['output']>;
  user: SessionUser;
};

export type SessionService = {
  __typename?: 'SessionService';
  title: Scalars['String']['output'];
};

export type SessionUser = {
  __typename?: 'SessionUser';
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  timeZone?: Maybe<Scalars['String']['output']>;
};

export type TimeRange = {
  __typename?: 'TimeRange';
  end?: Maybe<Scalars['AWSTime']['output']>;
  start?: Maybe<Scalars['AWSTime']['output']>;
};

export type GetAvailableDateTimesQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetAvailableDateTimesQuery = { __typename?: 'Query', getAvailableDateTimes: Array<{ __typename?: 'DateAvailability', date: string, times?: Array<{ __typename?: 'TimeRange', start?: string | null, end?: string | null }> | null }> };

export type GetSessionPageQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetSessionPageQuery = { __typename?: 'Query', getSessionPage: { __typename?: 'SessionPage', date?: string | null, time?: string | null, duration: number, host: { __typename?: 'SessionHost', firstName?: string | null, lastName?: string | null, photo?: string | null, profession?: string | null }, user: { __typename?: 'SessionUser', firstName?: string | null, lastName?: string | null, email?: string | null, timeZone?: string | null }, service: { __typename?: 'SessionService', title: string } } };

export const GetAvailableDateTimesDocument = gql`
    query GetAvailableDateTimes($userId: ID!) {
  getAvailableDateTimes(userId: $userId) {
    date
    times {
      start
      end
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAvailableDateTimesGQL extends Apollo.Query<GetAvailableDateTimesQuery, GetAvailableDateTimesQueryVariables> {
    override document = GetAvailableDateTimesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetSessionPageDocument = gql`
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
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetSessionPageGQL extends Apollo.Query<GetSessionPageQuery, GetSessionPageQueryVariables> {
    override document = GetSessionPageDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }