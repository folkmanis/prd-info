export abstract class MessageData {
  abstract toAction(): string;
  abstract toDescription(): string;
}
