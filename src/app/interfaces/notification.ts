import { Modules } from './system-preferences';

export enum SystemOperations {
    MESSAGE_DELETED,
    MESSAGE_ADDED,
    MESSAGE_ALL_READ,
    MESSAGES_UPDATED,
    USER_UPDATED,
}


export type ModulesWithNotifications = (Modules & 'jobs' | 'system');

export interface NotificationBase {
    module: ModulesWithNotifications;
    payload: any;
    timestamp: Date;
    instanceId?: string;
}

export interface JobsNotification extends NotificationBase {

    module: 'jobs';
    payload: {
        jobId: number,
        operation: 'create' | 'delete' | 'update',
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
