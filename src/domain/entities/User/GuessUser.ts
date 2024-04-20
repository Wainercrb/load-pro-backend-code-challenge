import { ValidationError } from '@domain/errors/ValidationError';
import { Role, User } from '@domain/entities/User/User';

export class GuessUser extends User {
  private static MIN_PASSWORD_LENGTH = 4;

  constructor(username: string, password: string, balance: number) {
    super(username, password, Role.guess, balance);

    this.validatePassword(password);
  }

  protected validatePassword(password: string) {
    if (password.length < GuessUser.MIN_PASSWORD_LENGTH) {
      throw new ValidationError('INVALID_PASSWORD_LENGTH');
    }
  }
}
