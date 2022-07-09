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
}
