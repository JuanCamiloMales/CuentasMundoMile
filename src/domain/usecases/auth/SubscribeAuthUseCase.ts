import type { AuthUser } from '../../entities/AuthUser';
import type { IAuthRepository, Unsubscribe } from '../../repositories/IAuthRepository';

export class SubscribeAuthUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  execute(callback: (user: AuthUser | null) => void): Unsubscribe {
    return this.repo.subscribeAuthState(callback);
  }
}