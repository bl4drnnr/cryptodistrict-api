export class RemovePhoneResponse {
  constructor(message = 'success') {
    this.message = message;
  }

  private readonly message: string;
}
