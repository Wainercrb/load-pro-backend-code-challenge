import { User } from '@domain/entities/User/User';
import { UserRow } from '@infrastructure/database/models/User';


export interface UpdateUserRepository {
  update(user: User): Promise<UserRow>;
}

export class UpdateUserService {
  constructor(private repository: UpdateUserRepository) { }

  async create(user: User) {
    return this.repository.update(user);
  }
}
