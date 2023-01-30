interface ISettings {
  firstName: string;
  lastName: string;
  bio: string;
}

export class GetSettingsResponse {
  constructor(settings: ISettings) {
    this.settings = settings;
  }

  private readonly settings: ISettings;
}
