import type { AuthUser } from '../../entities/AuthUser';
import type { IAuthRepository } from '../../repositories/IAuthRepository';

export class SignInWithGoogleUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(): Promise<AuthUser> {
    return this.repo.signInWithGoogle();
  }
}