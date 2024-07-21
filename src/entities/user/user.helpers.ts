import { TUser } from '@entities/user/user.types';

export function createFullName(user:TUser | undefined) {
  if (!user) return 'Не известно';
  return `${user.name} ${user.surname} ${user?.patronymic}`;
}