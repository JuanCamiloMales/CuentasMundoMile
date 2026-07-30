import type { IAuthRepository } from '../../repositories/IAuthRepository';

export class SignOutUseCase {
  constructor(private readonly repo: IAuthRepository) {}

  async execute(): Promise<void> {
    await this.repo.signOut();
  }
}