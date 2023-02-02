export class CloseAccountResponse {
  constructor(message = 'success') {
    this.message = message;
  }

  private readonly message: string;
}
