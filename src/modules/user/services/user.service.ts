import { Role } from '@auth/enums/role.enum';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdatePasswordDTO } from '@user/dto/update-password.dto';
import { UserCreateDTO } from '@user/dto/user-create.dto';
import { UserUpdateDTO } from '@user/dto/user-update.dto';
import { UserDTO } from '@user/dto/user.dto';
import { User } from '@user/entity/user.entity';
import { UserField } from '@user/enums/user-field.enum';
import { CurrentUser } from '@user/interfaces/current-user.interface';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUser(cpf: string): Promise<User> {
    const existingUser: User = await this.findUserBy(UserField.CPF, cpf);
    return existingUser;
  }

  async getUserByLogin(login: string): Promise<User> {
    const existingUser: User = await this.findUserBy(UserField.LOGIN, login);
    return existingUser;
  }

  async listUsers(): Promise<UserDTO[]> {
    const users: User[] = await this.userRepository.find();
    const usersDTO: UserDTO[] = users.map(
      (user: User): UserDTO => new UserDTO(user),
    );
    return usersDTO;
  }

  async createUser(user: UserCreateDTO): Promise<UserDTO> {
    const existingUser: User = await this.findUserBy(UserField.CPF, user.cpf);

    if (existingUser) {
      throw new BadRequestException('CPF already registered');
    }

    user.password = await bcrypt.hash(user.password, 15);
    const savedUser: User = await this.userRepository.save(user);
    const userDTO: UserDTO = new UserDTO(savedUser);
    return userDTO;
  }

  async updateUser(
    id: number,
    userUpdate: UserUpdateDTO,
    currentUser: CurrentUser,
  ): Promise<UserDTO> {
    if (currentUser.roles !== Role.ADMIN && userUpdate.role) {
      throw new UnauthorizedException(
        'You are not allowed to update your role',
      );
    }

    if (currentUser.roles !== Role.ADMIN && currentUser.id !== id) {
      throw new UnauthorizedException(
        'You do not have permission to update this user',
      );
    }

    let existingUser: User = await this.findUserBy(UserField.ID, id);

    try {
      existingUser = this.userRepository.merge(existingUser, userUpdate);
      const userUpdated: User = await this.userRepository.save(existingUser);
      return new UserDTO(userUpdated);
    } catch (error) {
      throw new Error('Error when updating user');
    }
  }

  async updatePassword(
    id: number,
    password: UpdatePasswordDTO,
    currentUser: CurrentUser,
  ) {
    
    if (currentUser.roles !== Role.ADMIN && currentUser.id !== id) {
      throw new UnauthorizedException(
        'You do not have permission to update this user',
      );
    }

    const user = await this.findUserBy(UserField.ID, id);


    const isMatch: boolean = await bcrypt.compare(
      password.lastPassword,
      user.password,
    );

    if(!isMatch){
      throw new BadRequestException('Inválid lastPassword')
    }



    // let existingUser: User = await this.findUserBy(UserField.ID, id);

    // try {
    //   existingUser = this.userRepository.merge(existingUser, userUpdate);
    //   const userUpdated: User = await this.userRepository.save(existingUser);
    //   return new UserDTO(userUpdated);
    // } catch (error) {
    //   throw new Error('Error when updating user');
    // }
  }

  async deleteUser(id: number): Promise<void> {
    const user: User = await this.findUserBy(UserField.ID, id);
    try {
      await this.userRepository.delete(user.id);
    } catch (error) {
      throw new Error('Error when deleting user');
    }
  }

  private async findUserBy(
    field: UserField,
    value: number | string,
  ): Promise<User> {
    console.log('field', field);
    const searchCriteria = { [field]: value };
    const existingUser: User = await this.userRepository.findOne({
      where: searchCriteria,
    });

    if (!existingUser) {
      throw new NotFoundException(`User not found`);
    }

    return existingUser;
  }
}
