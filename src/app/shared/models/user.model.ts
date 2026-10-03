export type UserRole = 'ADMIN' | 'STAFF' | 'STUDENT';

export interface LoginResponse {
  accessToken: string;
  email: string;
  role: UserRole;
}