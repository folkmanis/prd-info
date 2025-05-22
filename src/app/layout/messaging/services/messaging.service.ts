import { computed, inject, Injectable, linkedSignal, resource } from '@angular/core';
import { LoginService } from 'src/app/login';
import { MessagesApiService } from './messages-api.service';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  #api = inject(MessagesApiService);
  #login = inject(LoginService);

  messagesResource = resource({
    request: () => ({ user: this.#login.user() }),
    loader: ({ request }) => {
      if (request.user) {
        return this.#api.getAllMessages();
      } else {
        return Promise.resolve([]);
      }
    },
  });

  messages = linkedSignal(() => this.messagesResource.value() ?? []);

  messagesCount = computed(() => this.messages().length);

  unreadCount = computed(() => this.messages().reduce((count, msg) => count + +!msg.seen, 0));

  reload() {
    this.messagesResource.reload();
  }

  async markOneRead(id: string): Promise<void> {
    this.messages.update((messages) => messages.map((msg) => (msg._id === id ? { ...msg, seen: true } : msg)));
    await this.#api.setOneMessageRead(id);
    this.reload();
  }

  async markAllAsRead(): Promise<boolean> {
    this.messages.update((messages) => messages.map((msg) => ({ ...msg, seen: true })));
    const count = await this.#api.setAllMessagesRead();
    this.reload();
    return count > 0;
  }

  async deleteMessage(id: string): Promise<boolean> {
    this.messages.update((messages) => messages.filter((msg) => msg._id !== id));
    const count = await this.#api.deleteMessage(id);
    this.reload();
    return count > 0;
  }
}
