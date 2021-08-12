import { Modules } from './system-preferences';

export type ModulesWithNotifications = (Modules & 'jobs' | 'system') | 'global';

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
        operation: 'ftpWatcher';
        id: string;
    };
}

export interface GlobalNotification extends NotificationBase {
    module: 'global';
    payload: {
        operation: 'visibilityState';
        state: string;
    };
}

export type Notification = GlobalNotification | SystemNotification | JobsNotification;
