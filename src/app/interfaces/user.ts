import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  customers: z.string().array(),
  modules: z.string().array(),
});
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export const LastSeenSchema = z.object({
  date: z.coerce.date(),
  ip: z.string(),
});
export type LastSeen = z.infer<typeof LastSeenSchema>;

export const UserSessionSchema = z.object({
  _id: z.string(),
  lastSeen: LastSeenSchema,
});
export type UserSession = z.infer<typeof UserSessionSchema>;

export const GoogleUserSchema = z
  .object({
    id: z.string(),
    email: z.string(),
    verified_email: z.boolean(),
    name: z.string(),
    given_name: z.string(),
    family_name: z.string(),
    link: z.string(),
    picture: z.string(),
    gender: z.string(),
    locale: z.string(),
    hd: z.string(),
  })
  .partial();
export type GoogleUser = z.infer<typeof GoogleUserSchema>;

export const UserSchema = z.object({
  username: z.string().min(2).max(100),
  name: z.string().min(2).max(100),
  admin: z.coerce.boolean().default(false),
  userDisabled: z.coerce.boolean().default(false),
  eMail: z.email({ pattern: z.regexes.html5Email }).nullish(),
  last_login: z.coerce.date().optional(),
  preferences: UserPreferencesSchema,
  sessions: UserSessionSchema.array(),
  google: GoogleUserSchema.nullish(),
  prefersDarkMode: z.coerce.boolean().default(false),
});
export type User = z.infer<typeof UserSchema>;

export const LoginUserSchema = UserSchema.pick({
  eMail: true,
  google: true,
  last_login: true,
  name: true,
  preferences: true,
  prefersDarkMode: true,
  userDisabled: true,
  username: true,
});
export type LoginUser = z.infer<typeof LoginUserSchema>;

export const LoginUserUpdateSchema = LoginUserSchema.partial()
  .pick({
    name: true,
    eMail: true,
    google: true,
    prefersDarkMode: true,
  })
  .extend({
    password: z.string().min(6).max(100),
  })
  .partial();
export type LoginUserUpdate = z.infer<typeof LoginUserUpdateSchema>;

export const UserUpdateSchema = UserSchema.partial().omit({
  sessions: true,
  last_login: true,
});
export type UserUpdate = z.infer<typeof UserUpdateSchema>;

export const UserCreateSchema = UserSchema.omit({
  sessions: true,
  last_login: true,
}).extend({
  password: z.string().min(6).max(100),
});
export type UserCreate = z.infer<typeof UserCreateSchema>;

export const UserListSchema = UserSchema.pick({
  admin: true,
  last_login: true,
  name: true,
  preferences: true,
  userDisabled: true,
  username: true,
});
export type UserList = z.infer<typeof UserListSchema>;

export function newUser(): User {
  return {
    username: '',
    name: '',
    admin: false,
    userDisabled: false,
    eMail: '',
    last_login: undefined,
    preferences: {
      customers: [],
      modules: [],
    },
    sessions: [],
    google: null,
    prefersDarkMode: false,
  };
}
