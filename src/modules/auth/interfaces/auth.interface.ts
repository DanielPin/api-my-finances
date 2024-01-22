import { User } from 'src/modules/user/entity/user.entity';
import { IToken } from './token.interface';

export interface IAuth {
  user: User;
  token: IToken;
}
