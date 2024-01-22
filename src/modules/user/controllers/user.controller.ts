import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserDTO } from '../dto/user.dto';
import { User } from '../entity/user.entity';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':name')
  async getUser(@Param() params: any): Promise<UserDTO> {
    const user: User = await this.userService.getUser(params.name);
    const userDTO: UserDTO = new UserDTO(user);

    return userDTO;
  }

  @Post('/create')
  async createUser(@Body() user: User): Promise<UserDTO> {
    return this.userService.createUser(user);
  }
}
