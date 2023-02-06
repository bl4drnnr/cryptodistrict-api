export class SetPhoneResponse {
  constructor(message = 'success') {
    this.message = message;
  }

  private readonly message: string;
}
