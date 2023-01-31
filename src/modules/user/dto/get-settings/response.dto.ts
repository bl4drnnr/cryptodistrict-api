interface ISettings {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  twitter: string;
  linkedIn: string;
  personalWebsite: string;
  title: string;
  bio: string;
}

export class GetSettingsResponse {
  constructor(settings: ISettings) {
    this.settings = settings;
  }

  private readonly settings: ISettings;
}
