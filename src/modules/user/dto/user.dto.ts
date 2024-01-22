import { User } from '../entity/user.entity';

export class UserDTO {
  constructor(user: User) {
    this.name = user.fullName;
    this.createdAt = user.createdAt;
    this.role = user.role;
  }

  name: string;
  createdAt: string;
  role: string;
}
