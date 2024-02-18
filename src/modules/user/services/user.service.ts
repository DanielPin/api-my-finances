import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from '@user/dto/user.dto';
import { User } from '@user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUser(login: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { login },
    });
    if (!user) {
      throw new NotFoundException(`Login ${login} not found`);
    }
    return user;
  }

  async listUsers(): Promise<UserDTO[]> {
    const users: User[] = await this.userRepository.find();
    const usersDTO: UserDTO[] = users.map(
      (user: User): UserDTO => new UserDTO(user),
    );
    return usersDTO;
  }

  async createUser(user: User): Promise<UserDTO> {
    const existingUser: User = await this.userRepository.findOne({
      where: { cpf: user.cpf },
    });

    if (existingUser) {
      throw new BadRequestException('CPF already registered');
    }

    user.password = await bcrypt.hash(user.password, 15);
    const savedUser: User = await this.userRepository.save(user);
    const userDTO: UserDTO = new UserDTO(savedUser);
    return userDTO;
  }
}
