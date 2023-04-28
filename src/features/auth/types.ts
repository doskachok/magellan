export interface IAuthPayload {
  id: string,
  token: string
}

export interface ILoginForm {
  login: string;
  password: string;
}

export interface IUser {
  email: string;
  name?: string;
  username: string;
  id: string;
  avatarId: string
}

export interface IRegisterForm {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}


