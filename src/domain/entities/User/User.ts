import { ValidationError } from '@domain/errors/ValidationError';

export enum Role {
  guess = 'guess',
  admin = 'admin',
}

export abstract class User {
  private static EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  private username: string;
  private password: string;
  private balance: number;
  private role: Role;

  constructor(username: string, password: string, role: Role, balance: number) {
    // this.validateEmail(email);

    this.username = username;
    this.password = password;
    this.role = role;
    this.balance = balance;
  }

  protected abstract validatePassword(password: string): void;

  private validateEmail(email: string) {
    const isValid = User.EMAIL_REGEX.test(email);

    if (!isValid) {
      throw new ValidationError('INVALID EMAIL PATTER');
    }
  }

  getUsername(): string {
    return this.username;
  }

  getPassword(): string {
    return this.password;
  }

  getRole(): Role {
    return this.role;
  }

  getBalance(): number {
    return this.balance;
  }
}
