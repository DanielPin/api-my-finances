import { Role } from '@auth/enums/role.enum';
import { IsNotEmptyString } from '@card/validators/not-empty-string-validator';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class UserUpdateDTO {
  @IsString()
  @IsOptional()
  @IsNotEmptyString()
  fullName?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @IsOptional()
  @IsEmail()
  @IsNotEmptyString()
  email?: string;
}
