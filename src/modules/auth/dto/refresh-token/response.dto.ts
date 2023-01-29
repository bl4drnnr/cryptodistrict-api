export class RefreshTokenResponse {
  constructor(_at: string) {
    this._at = _at;
  }

  private readonly _at: string;
}
