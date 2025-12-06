import { User } from './user.types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  user: User;
  token?: string;
}

export interface AuthUser extends User {
  permissions?: string[];
}

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
  permissions?: string[];
}
