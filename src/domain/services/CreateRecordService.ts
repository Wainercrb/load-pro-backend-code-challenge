import { Record } from '@domain/entities/Record/Record';
import { OperationRow } from '@infrastructure/database/models/Operation';
import { RecordRow } from '@infrastructure/database/models/Record';
import { UserRow } from '@infrastructure/database/models/User';

export interface CreateRecordRepository {
  create(record: Record): Promise<RecordRow>;
}

export class CreateRecordService {
  constructor(private repository: CreateRecordRepository) {}

  async create(user: UserRow, operation: OperationRow, newBalance: number) {
    const operationResponse = {
      prevBalance: user.balance,
      newBalance,
      output: '', // TODO generate the output
    };

    const newRecord = new Record(
      operation.id,
      operation.id,
      operation.cost,
      JSON.stringify(operationResponse),
      new Date(),
    );

    return this.repository.create(newRecord);
  }
}
