export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export enum LoadingState {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Error = 'error'
}
