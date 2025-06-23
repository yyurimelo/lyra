export type UserDataModel = {
  id: number;
  name: string;
  email: string;
  description?: string | null;
  userIdentifier: string;
  appearancePrimaryColor?: string | null;
  appearanceTextPrimaryLight?: string | null;
  appearanceTextPrimaryDark?: string | null;
  createdAt: string;
};
