export class RemoveFromFavoriteResponse {
  constructor(message = 'success') {
    this.message = message;
  }

  private readonly message: string;
}
