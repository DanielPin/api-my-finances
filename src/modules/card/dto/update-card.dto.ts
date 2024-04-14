import { IsJpgFile } from '@card/validators/is-jpg-file-validator';
import { IsNotEmptyString } from '@card/validators/not-empty-string-validator';
import { IsOptional, IsString } from 'class-validator';

export class updateCardDTO {
  @IsString()
  @IsNotEmptyString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmptyString()
  @IsJpgFile()
  @IsOptional()
  icon?: string;
}
