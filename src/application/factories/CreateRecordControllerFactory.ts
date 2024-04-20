import { SequelizeCreateRecordRepository } from '@domain/repositories/SequelizeCreateRecordRepository';
import { SequelizeFindOperationRepository } from '@domain/repositories/SequelizeFindOperationRepository';
import { SequelizeFindUserRepository } from '@domain/repositories/SequelizeFindUserRepository';
import { CreateRecordService } from '@domain/services/CreateRecordService';
import { FindOperationService } from '@domain/services/FindOperationService';
import { FindUserService } from '@domain/services/FindUserService';
import { CreateRecordController } from '@infrastructure/controller/CreateRecordController';

export class CreateRecordControllerFactory {
  static make() {
    const createRecordRepository = new SequelizeCreateRecordRepository();
    const createRecordService = new CreateRecordService(createRecordRepository);

    const findUserRepository = new SequelizeFindUserRepository();
    const findUserService = new FindUserService(findUserRepository);

    const findOperationRepository = new SequelizeFindOperationRepository();
    const findOperationService = new FindOperationService(findOperationRepository);

    const controller = new CreateRecordController(createRecordService, findUserService, findOperationService);

    return controller;
  }
}
