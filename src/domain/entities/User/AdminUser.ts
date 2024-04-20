import { ValidationError } from "@domain/errors/ValidationError";
import { Role, User } from "@domain/entities/User/User";

export class AdminUser extends User {
  private static MIN_PASSWORD_LENGTH = 8;

  constructor(email: string, password: string, balance: number) {
    super(email, password, Role.admin, balance);

    this.validatePassword(password);
  }

  protected validatePassword(password: string) {
    if (password.length < AdminUser.MIN_PASSWORD_LENGTH) {
      throw new ValidationError('INVALID_PASSWORD_LENGTH')
    }
  }
}