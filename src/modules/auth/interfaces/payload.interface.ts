import { Role } from '../enums/role.enum';

export interface IPayload {
  username: string;
  sub: string;
  roles: Role;
  iat: number;
  exp: number;
}
