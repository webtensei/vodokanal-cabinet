import { TLoginResponse } from './session.types';

export function mapUser(userDto: TLoginResponse): TLoginResponse {
  return {
    ...userDto,
  };
}
