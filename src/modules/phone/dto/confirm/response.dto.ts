export class PhoneConfirmationResponse {
  constructor(message = 'success') {
    this.message = message;
  }

  private readonly message: string;
}
