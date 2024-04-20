import { User, Role } from '../../../src/domain/entities/User/User';
import { ValidationError } from '../../../src/domain/errors/ValidationError';

describe('[DOMAIN|MODEL] User', () => {
  describe('constructor', () => {
    it('should create a new User instance with valid email', () => {
      const email = 'test@example.com';
      const password = 'password123';
      const role = Role.author;

      const user = new TestUser(email, password, role);

      expect(user.getEmail()).toBe(email);
      expect(user.getPassword()).toBe(password);
      expect(user.getRole()).toBe(role);
    });

    it('should throw ValidationError with invalid email', () => {
      const email = 'invalid-email';
      const password = 'password123';
      const role = Role.author;

      expect(() => new TestUser(email, password, role)).toThrowError(ValidationError);
    });
  });

  describe('validatePassword', () => {
    it('should throw an error if the password is too short', () => {
      const email = 'test@example.com';
      const password = 'short';
      const role = Role.author;
      const user = new TestUser(email, password, role);

      expect(() => user.validatePassword(password)).toThrowError(ValidationError);
    });

    it('should not throw an error if the password is valid', () => {
      const email = 'test@example.com';
      const password = 'validPassword123';
      const role = Role.author;
      const user = new TestUser(email, password, role);

      expect(() => user.validatePassword(password)).not.toThrowError();
    });
  });
});

class TestUser extends User {
  validatePassword(password: string): void {
    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }
  }
}
