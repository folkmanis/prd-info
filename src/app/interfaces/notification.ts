import { Modules } from './system-preferences';

export type ModulesWithNotifications = 'jobs' | 'system';

export interface NotificationBase {
    module: ModulesWithNotifications;
    _id: string;
    payload: any;
    timestamp: Date;
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
        operation: 'visibilityState' | 'ftpWatcher';
        id: string;
    };
}

export type Notification = SystemNotification | JobsNotification;
