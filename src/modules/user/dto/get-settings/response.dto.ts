interface ISettings {
  test: string;
}

export class GetSettingsResponse {
  constructor(settings: ISettings) {
    this.settings = settings;
  }

  private readonly settings: ISettings;
}
