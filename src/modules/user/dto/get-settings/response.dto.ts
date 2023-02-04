interface IPersonalInformation {
  firstName: string;
  lastName: string;
  twitter: string;
  linkedIn: string;
  personalWebsite: string;
  title: string;
  bio: string;
  username: string;
  publicEmail: boolean;
  createdAt: Date;
}

interface INotificationSettings {
  receiveNotifications: boolean;
}

interface ISecuritySettings {
  emailChanged: boolean;
  lastPassChange: Date;
  twoFaType: string;
  email: string;
  phoneNumber: string;
}

interface ISettings {
  personalInformation: IPersonalInformation;
  notificationSettings: INotificationSettings;
  securitySettings: ISecuritySettings;
}

export class GetSettingsResponse {
  constructor(settings: ISettings) {
    this.settings = settings;
  }

  private readonly settings: ISettings;
}
