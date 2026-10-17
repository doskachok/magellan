export interface User {
  id: string;
  name?: string | null;
  email: string;
  username: string;
  avatarId?: string | null;
}

export interface UpdateUser {
  id: string;
  name: string;
  avatarId?: string | null;
}

export const getDisplayName = (user: Pick<User, 'name' | 'username'>) => user.name?.trim() || user.username;
