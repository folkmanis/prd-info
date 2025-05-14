import { MODULES } from './system-preferences';

export enum SystemOperations {
  MessageDeleted,
  MessageAdded,
  MessageAllRead,
  MessagesUpdated,
  UserUpdated,
}

export type ModulesWithNotifications = ((typeof MODULES)[number] & 'jobs') | 'system';

export interface NotificationBase {
  module: ModulesWithNotifications;
  payload: any;
  timestamp: Date;
  instanceId?: string;
}

export interface JobsNotification extends NotificationBase {
  module: 'jobs';
  payload: {
    jobId: number;
    operation: 'create' | 'delete' | 'update';
  };
}

export interface SystemNotification extends NotificationBase {
  module: 'system';
  payload: {
    operation: SystemOperations;
    id: string;
  };
}

export type Notification = SystemNotification | JobsNotification;
