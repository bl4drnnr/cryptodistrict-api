export class SetPersonalSettingsResponse {
  constructor(message = 'success') {
    this.message = message;
  }
  private readonly message: string;
}
