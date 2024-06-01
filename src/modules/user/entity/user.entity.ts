import { Role } from '@auth/enums/role.enum';
import { IsCpf } from '@user/helpers/teste';
import { Matches } from 'class-validator';
import * as moment from 'moment-timezone';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';

const dateTransformer: ValueTransformer = {
  from: (dbValue: Date): string => {
    return moment(dbValue).tz('America/Sao_Paulo').format();
  },
  to: (entityValue: string): Date => {
    return moment.tz(entityValue, 'America/Sao_Paulo').toDate();
  },
};

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'full_name', length: 100, nullable: false })
  fullName: string;

  @Column({ name: 'login', length: 100, nullable: false })
  login: string;

  @Column({ name: 'email', length: 100, nullable: false })
  email: string;

  @IsCpf({ message: 'CPF inválido' })
  @Column({ name: 'cpf', nullable: false })
  cpf: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'A senha deve ter pelo menos 8 caracteres, 1 caractere maiúsculo, 1 caractere minúsculo e 1 caractere especial',
    },
  )
  @Column({ name: 'password', length: 255, nullable: false })
  password: string;

  @CreateDateColumn({ name: 'created_at', transformer: dateTransformer })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', transformer: dateTransformer })
  updatedAt: string;

  @Column({ name: 'role', type: 'enum', enum: Role })
  role: Role;
}
