import { CreateUserControllerFactory } from '../../../src/application/factories/CreateUserControllerFactory';
import { CreateUserController } from '../../../src/infrastructure/controller/CreateUserController';
import { SequelizeUserRepository } from '../../../src/domain/repositories/SequelizeUserRepository';

describe('[APPLICATION|FACTORIES] CreateUserControllerFactory', () => {
  it('should create an instance of CreateUserController', () => {
    jest.spyOn(SequelizeUserRepository.prototype, 'create').mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      role: 'admin',
    });
    const factory = CreateUserControllerFactory.make();

    const controller = factory;

    expect(controller).toBeInstanceOf(CreateUserController);
    expect((controller as CreateUserController).handle).toBeInstanceOf(Function);
  });
});
