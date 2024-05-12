import { z } from 'zod';

export enum UserRoles {
  VISITOR = 'VISITOR',
  USER = 'USER',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
}

export const UserResponse = z.object({
  name: z.string(),
  patronymic: z.string().nullish(),
  surname: z.string(),
  role: z.enum(['VISITOR', 'USER', 'ADMIN', 'OWNER']),
  username: z.number(),
  preferred_settings: z.object({}).nullish(),
  contacts: z.object({
    email: z.string(),
    phone: z.string(),
    email_activated_at: z.date().nullish(),
    phone_activated_at: z.date().nullish(),
    email_activated: z.boolean(),
    phone_activated: z.boolean(),
  }),
  addresses: z.object({}).nullish(),
});
