import { apiClient } from './apiClient';
import type {
  IAuthRepository,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '../../domain/repositories';
import type { User } from '../../domain/entities';

export class AuthApi implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post('/auth/login', credentials);
    return {
      user: data.data.user,
      token: data.data.token,
    };
  }

  async register(registerData: RegisterData): Promise<AuthResponse> {
    const { data } = await apiClient.post('/auth/register', registerData);
    return {
      user: data.data.user,
      token: data.data.token,
    };
  }

  async getCurrentUser(token: string): Promise<User> {
    const { data } = await apiClient.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data.user;
  }
}
