import { normalizeEmail } from '../../entities/AuthUser';
import type { IAuthRepository, Unsubscribe } from '../../repositories/IAuthRepository';

export class CheckEmailAllowedUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async check(email: string): Promise<boolean> {
    return this.repo.isEmailAllowed(normalizeEmail(email));
  }

  subscribe(email: string, callback: (allowed: boolean) => void): Unsubscribe {
    return this.repo.subscribeEmailAllowed(normalizeEmail(email), callback);
  }
}