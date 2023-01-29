export class VerifyPhoneResponse {
  constructor(message = 'success') {
    this.message = message;
  }

  private readonly message: string;
}
