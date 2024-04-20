import z, { ZodError } from 'zod';
import { Request, Response } from 'express';
import { ValidationError } from '@domain/errors/ValidationError';
import { CreateRecordService } from '@domain/services/CreateRecordService';
import { FindUserService } from '@domain/services/FindUserService';
import { FindOperationService } from '@domain/services/FindOperationService';
import { Record } from '@domain/entities/Record/Record';

const payload = z.object({
  operation_id: z.number(),
  user_id: z.number(),
});

export class CreateRecordController {
  constructor(
    private recordService: CreateRecordService,
    private userService: FindUserService,
    private operationsService: FindOperationService,
  ) {}

  async handle(req: Request, res: Response) {
    try {
      // TODO get the user_id from the token
      const { operation_id, user_id } = payload.parse(req.body);

      const foundUser = await this.userService.find(user_id);

      if (!foundUser)
        return res.status(400).json({
          message: ['User not found'],
        });

      const foundOperation = await this.operationsService.find(operation_id);

      if (!foundOperation)
        return res.status(400).json({
          message: ['Operation not found'],
        });

      const newBalance = foundUser.balance / foundOperation.cost;

      if (newBalance <= 0)
        if (!foundOperation)
          return res.status(400).json({
            message: ['Balance is 0'],
          });

      const record = await this.recordService.create(foundUser, foundOperation, newBalance);

      // TODO: update user balance

      return res.status(200).json(record);
    } catch (err) {
      if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
      }

      if (err instanceof ZodError) {
        return res.status(400).json({ error: err.errors });
      }

      return res.status(500).end();
    }
  }
}
