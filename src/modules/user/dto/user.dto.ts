import { User } from '../entity/user.entity';

export class UserDTO {
  constructor(user: User) {
    this.id = user.id;
    this.fullName = user.fullName;
    this.role = user.role;
    this.email = user.email;
    this.cpf = user.cpf;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
  id: number;
  fullName: string;
  createdAt: string;
  role: string;
  email: string;
  cpf: string;
  updatedAt: string;
}
