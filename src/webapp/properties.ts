export enum AccessTypes {
  Everyone = 'public',
  Anonymous = 'anonymous',
  Recruiter = 'recruiter',
  Candidate = 'candidate',
  User = 'user'
}

/* Request types supported by the system */
export enum RequestMethods {
  'GET' = 'get',
  'POST' = 'post',
  'DELETE' = 'delete',
  'PATCH' = 'patch'
}

/* Custom headers from the API */
export enum Headers {
  Authorization = 'authorization'
}

/* Webapp request lifecycle */
export enum Lifecycle {
  Idle = 'idle',
  Triggered = 'triggered',
  Completed = 'completed',
  Processed = 'processed',
  Invalid = 'invalid'
}
