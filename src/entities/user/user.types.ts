import { z } from 'zod';
import { UserResponse } from '@entities/user/user.contracts';

export type TUser = z.infer<typeof UserResponse>;