import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ModulesWithNotifications, Notification } from 'src/app/interfaces';
import { ApiBase, HttpOptions } from 'src/app/library/http';


interface NotificationResponse {
    data: Notification[];
    timestamp: Date;
}

export class NotificationsApi extends ApiBase<Notification> {

    getNotification(
        modules: ModulesWithNotifications[],
        fromDate: Date | undefined,
    ): Observable<NotificationResponse> {

        return this.http.get<{ data: Notification[], timestamp: string; }>(
            this.path,
            new HttpOptions({
                modules,
                from: fromDate.getTime()
            })
        ).pipe(
            map(resp => ({ data: resp.data, timestamp: new Date(resp.timestamp) }))
        );
    }
}
