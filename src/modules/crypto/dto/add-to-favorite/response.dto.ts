export class AddToFavoriteResponse {
  constructor(message = 'success') {
    this.message = message;
  }

  private readonly message: string;
}
