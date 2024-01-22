import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { Repository } from 'typeorm';
import { promisify } from 'util';
import { UserDTO } from '../dto/user.dto';
import { User } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async getUser(name: string): Promise<User> {
    const user: User = await this.user.findOne({
      where: { fullName: name },
    });
    const key: Buffer = await this.getCipherKey();
    const iv: Buffer = Buffer.from(user.iv, 'hex');

    user.cpf = await this.decryptText(user.cpf, key, iv);

    return user;
  }

  async createUser(user: User): Promise<UserDTO> {
    const iv: Buffer = randomBytes(16);
    const key: Buffer = await this.getCipherKey();

    user.iv = iv.toString('hex');
    user.cpf = await this.encryptText(user.cpf, key, iv);
    user.password = await bcrypt.hash(user.password, 15);

    const savedUser: User = await this.user.save(user);
    const userDTO: UserDTO = new UserDTO(savedUser);

    return userDTO;
  }

  private async getCipherKey(): Promise<Buffer> {
    return (await promisify(scrypt)(
      this.configService.get<string>('SECRET_CRYPTO'),
      'salt',
      32,
    )) as Buffer;
  }

  private async encryptText(
    text: string,
    key: Buffer,
    iv: Buffer,
  ): Promise<string> {
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const encryptedText: Buffer = Buffer.concat([
      cipher.update(text),
      cipher.final(),
    ]);
    return encryptedText.toString('hex');
  }

  private async decryptText(
    encryptedText: string,
    key: Buffer,
    iv: Buffer,
  ): Promise<string> {
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const textBuffer: Buffer = Buffer.from(encryptedText, 'hex');
    const decryptedText: Buffer = Buffer.concat([
      decipher.update(textBuffer),
      decipher.final(),
    ]);
    return decryptedText.toString('utf8');
  }
}
