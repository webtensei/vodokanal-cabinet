import { TSession } from './session.types';

export function mapUser(userDto: TSession): TSession {
  return {
    ...userDto,
  };
}
