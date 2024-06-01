import { Role } from '@auth/enums/role.enum';

export interface CurrentUser {
  id: number;
  sub: string;
  roles: Role;
}
