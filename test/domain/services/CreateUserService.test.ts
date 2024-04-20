import { CreateUserService } from '../../../src/domain/services/CreateUserService';
import { CreateUserRepository } from '../../../src/domain/services/CreateUserService';
import { AdminUser } from '../../../src/domain/entities/User/AdminUser';
import { AuthorUser } from '../../../src/domain/entities/User/AuthorUser';
import { Role } from '../../../src/domain/entities/User/User';
import { ValidationError } from '../../../src/domain/errors/ValidationError';

describe('[APPLICATION|SERVICES] CreateUserService', () => {
  describe('create', () => {
    it('should create a new user with valid parameters', async () => {
      const mockRepository: CreateUserRepository = {
        create: jest.fn().mockResolvedValue({ id: 1 }),
      };
      const service = new CreateUserService(mockRepository);
      const email = 'test@example.com';
      const password = 'password123';
      const role = Role.admin;

      const result = await service.create(email, password, role);

      expect(result).toEqual({ id: 1 });
      expect(mockRepository.create).toHaveBeenCalledWith(expect.any(AdminUser));
    });

    it('should throw ValidationError with invalid role', async () => {
      const mockRepository: CreateUserRepository = {
        create: jest.fn(),
      };
      const service = new CreateUserService(mockRepository);
      const email = 'test@example.com';
      const password = 'password123';
      const role = 'invalid_role';

      await expect(service.create(email, password, role)).rejects.toThrowError(ValidationError);
    });
  });

  describe('getUserInstance', () => {
    it("should return an instance of AdminUser for role 'admin'", () => {
      const mockRepository: CreateUserRepository = {
        create: jest.fn(),
      };
      const service = new CreateUserService(mockRepository);
      const email = 'test@example.com';
      const password = 'password123';
      const role = Role.admin;

      const user = service['getUserInstance'](email, password, role);

      expect(user).toBeInstanceOf(AdminUser);
      expect(user.getEmail()).toBe(email);
      expect(user.getPassword()).toBe(password);
    });

    it("should return an instance of AuthorUser for role 'author'", () => {
      const mockRepository: CreateUserRepository = {
        create: jest.fn(),
      };
      const service = new CreateUserService(mockRepository);
      const email = 'test@example.com';
      const password = 'password123';
      const role = Role.author;

      const user = service['getUserInstance'](email, password, role);

      expect(user).toBeInstanceOf(AuthorUser);
      expect(user.getEmail()).toBe(email);
      expect(user.getPassword()).toBe(password);
    });

    it('should throw ValidationError with invalid role', () => {
      const mockRepository: CreateUserRepository = {
        create: jest.fn(),
      };
      const service = new CreateUserService(mockRepository);
      const email = 'test@example.com';
      const password = 'password123';
      const role = 'invalid_role';

      expect(() => service['getUserInstance'](email, password, role)).toThrowError(ValidationError);
    });
  });
});
