import { Modules } from './system-preferences';

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
        operation: 'ftpWatcher';
        id: string;
    };
}

export type Notification = SystemNotification | JobsNotification;
