import { IsJpgFile } from '@card/validators/is-jpg-file-validator';
import { IsNotEmptyString } from '@card/validators/not-empty-string-validator';
import { IsString } from 'class-validator';
import * as moment from 'moment-timezone';
import {
  BeforeUpdate,
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

@Entity({ name: 'Card' })
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsString()
  @IsNotEmptyString()
  @Column({ name: 'name', nullable: false })
  name: string;

  @IsString()
  @IsNotEmptyString()
  @IsJpgFile()
  @Column({ name: 'icon', nullable: false })
  icon: string;

  @CreateDateColumn({ name: 'created_at', transformer: dateTransformer })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', transformer: dateTransformer })
  updatedAt: string;

  @BeforeUpdate()
  updateDate() {
    this.updatedAt = moment().tz('America/Sao_Paulo').format();
  }
}
