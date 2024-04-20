import { SequelizeUserRepository } from '../../../src/domain/repositories/SequelizeUserRepository';
import { Role, User } from '../../../src/domain/entities/User/User';

jest.mock('@infrastructure/database/models/User', () => ({
  SequelizeUser: {
    create: jest.fn().mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      role: "admin",
    }),
  },
}));

class TestUser extends User {
  protected validatePassword(_: string): void {
    throw new Error('Method not implemented.');
  }
}

describe('[APPLICATION|DOMAIN|REPOSITORIES] SequelizeUserRepository', () => {
  describe('create', () => {
    it('should create a new user in the database', async () => {
      const repository = new SequelizeUserRepository();
      const user = new TestUser('test@example.com', 'password123', Role.admin);

      const result = await repository.create(user);

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        password: '',
        role: "admin",
      });
      // expect(SequelizeUser.create).toHaveBeenCalledWith(DEFAULT_RESPONSE);
    });
  });
});
