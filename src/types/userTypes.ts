export interface IUser {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarId: string;
}

export interface IUpdateUser extends Omit<IUser, 'email' | 'username'> {
}

export const userToUpdateUser = (user: IUser): IUpdateUser => ({
  id: user.id,
  name: user.name,
  avatarId: user.avatarId,
}); 