interface EventLogBase {
  id: number;
  name: string;
  session_code: number;
}

export interface EventLogDB extends EventLogBase {
  duration: number;
  metadata: string;
  created_on: string;
}

export interface EventLog extends EventLogBase {
  duration?: number;
  metadata?: string;
  created_on: Date;
}
