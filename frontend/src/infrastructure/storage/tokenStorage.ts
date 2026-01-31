import { config } from '../../config';

export class TokenStorage {
  static save(token: string): void {
    localStorage.setItem(config.tokenKey, token);
  }

  static get(): string | null {
    return localStorage.getItem(config.tokenKey);
  }

  static remove(): void {
    localStorage.removeItem(config.tokenKey);
  }

  static exists(): boolean {
    return !!this.get();
  }
}
