import { ApiBase, HttpOptions } from 'src/app/library/http';
import { Observable } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';
import { User, Login, LoginResponse } from 'src/app/interfaces';
import { Message, MessageResponse, JobMessageActions, Notification, ModulesWithNotifications } from 'src/app/interfaces';


export class NotificationsApi extends ApiBase<Notification> {

    getNotification(modules: ModulesWithNotifications[], fromDate: Date | undefined): Observable<{ data: Notification[], timestamp: Date; }> {
        return this.http.get<{ data: Notification[], timestamp: string; }>(
            this.path,
            new HttpOptions({
                modules,
                from: fromDate?.getTime()
            })
        ).pipe(
            map(resp => ({ data: resp.data, timestamp: new Date(resp.timestamp) }))
        );
    }
}
