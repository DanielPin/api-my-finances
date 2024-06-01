import { Role } from '@auth/enums/role.enum';
import { IsCpf } from '@user/helpers/teste';
import { IsEmail, IsEnum, IsString, Matches } from 'class-validator';

export class UserCreateDTO {
  @IsString()
  fullName: string;

  @IsString()
  login: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsCpf({ message: 'CPF inválido' })
  cpf: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'A senha deve ter pelo menos 8 caracteres, 1 caractere maiúsculo, 1 caractere minúsculo e 1 caractere especial',
    },
  )
  @IsString()
  password: string;

  @IsEnum(Role)
  role: Role;
}
