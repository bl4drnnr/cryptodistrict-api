export class UnbindPhoneResponse {
  constructor(message = 'success') {
    this.message = message;
  }

  private readonly message: string;
}
