export class FreezeAccountResponse {
  constructor(message = 'success') {
    this.message = message;
  }

  private readonly message: string;
}
