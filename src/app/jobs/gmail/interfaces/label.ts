const labelMap: Map<string, string> = new Map([
    ['IMPORTANT', 'Svarīgi'],
    ['TRASH', 'Miskaste'],
    ['DRAFT', 'Melnraksti'],
    ['SPAM', 'Mēstules'],
    ['STARRED', 'Ar zvaigznīti'],
    ['CATEGORY_PERSONAL', 'Personīgi'],
]);


export class Label {
    id: string;
    name: string;
    messageListVisibility: 'show' | 'hide';
    labelListVisibility: 'labelShow' | 'labelShowIfUnread' | 'labelHide';
    type: 'system' | 'user';
    messagesTotal: number;
    messagesUnread: number;
    threadsTotal: number;
    threadsUnread: number;
    color: {
        textColor: string,
        backgroundColor: string,
    };


    get displayName(): string {
        return labelMap.get(this.name) || this.name;
    }


}

export type LabelListItem = Pick<Label, 'id' | 'name' | 'messageListVisibility' | 'labelListVisibility' | 'displayName'>;
