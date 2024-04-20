import { Request, Response } from 'express';
import { CreateUserController } from '../../../src/infrastructure/controller/CreateUserController';
import { CreateUserRepository, CreateUserService } from '../../../src/domain/services/CreateUserService';
import { SignInUserRepository, SignInUserService } from '../../../src/domain/services/SignInUserService';
import { Role } from '../../../src/domain/entities/User/User';

jest.mock('@domain/services/CreateUserService', () => ({
  CreateUserService: jest.fn().mockImplementation(() => ({
    create: jest.fn().mockReturnValue({ id: 1 }),
  })),
}));

jest.mock('@domain/services/SignInUserService', () => ({
  SignInUserService: jest.fn().mockImplementation(() => ({
    findByEmail: jest.fn().mockReturnValue(null),
  })),
}));

describe('[INFRASTRUCTURE|CONTROLLER] CreateUserController', () => {
  it('should create a new user with valid payload', async () => {
    const mockRequest = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        role: 'author',
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
      cookie: jest.fn(),
    };
    const mockCreateUserRepository: CreateUserRepository = {
      create: jest.fn(),
    };
    const mockSignInUserRepository: SignInUserRepository = {
      findByEmail: jest.fn(),
    };
    const createUserService = new CreateUserService(mockCreateUserRepository);
    const sinInUserService = new SignInUserService(mockSignInUserRepository);

    const controller = new CreateUserController(createUserService, sinInUserService);

    await controller.handle(mockRequest as Request, mockResponse as unknown as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ id: 1 });
  });

  it('should return 400 with ZodError message for payload validation error [password]', async () => {
    const mockRequest = {
      body: {
        email: 'test@example.com',
        role: Role.admin,
        password: '',
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockCreateUserRepository: CreateUserRepository = {
      create: jest.fn(),
    };
    const mockSignInUserRepository: SignInUserRepository = {
      findByEmail: jest.fn(),
    };
    const createUserService = new CreateUserService(mockCreateUserRepository);
    const sinInUserService = new SignInUserService(mockSignInUserRepository);

    const controller = new CreateUserController(createUserService, sinInUserService);

    await controller.handle(mockRequest as Request, mockResponse as unknown as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: expect.arrayContaining([
        {
          code: 'too_small',
          exact: false,
          inclusive: true,
          message: 'String must contain at least 5 character(s)',
          minimum: 5,
          path: ['password'],
          type: 'string',
        },
      ]),
    });
  });

  it('should return 400 with ZodError message for payload validation error [role]', async () => {
    const mockRequest = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        role: 'invalid_role',
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockCreateUserRepository: CreateUserRepository = {
      create: jest.fn(),
    };
    const mockSignInUserRepository: SignInUserRepository = {
      findByEmail: jest.fn(),
    };
    const createUserService = new CreateUserService(mockCreateUserRepository);
    const sinInUserService = new SignInUserService(mockSignInUserRepository);

    const controller = new CreateUserController(createUserService, sinInUserService);

    await controller.handle(mockRequest as Request, mockResponse as unknown as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: expect.any(Array) });
  });

  it('should return 500 with error message for unknown errors', async () => {
    const mockRequest = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        role: Role.admin,
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };
    const mockCreateUserRepository: CreateUserRepository = {
      create: jest.fn(),
    };
    const mockSignInUserRepository: SignInUserRepository = {
      findByEmail: jest.fn(),
    };
    const createUserService = new CreateUserService(mockCreateUserRepository);
    const sinInUserService = new SignInUserService(mockSignInUserRepository);

    const controller = new CreateUserController(createUserService, sinInUserService);

    (createUserService.create as jest.Mock).mockRejectedValue(new Error('Unknown error'));

    await controller.handle(mockRequest as Request, mockResponse as unknown as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.end).toHaveBeenCalled();
  });
});
