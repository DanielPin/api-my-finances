import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@auth/enums/role.enum';
import { AuthGuard } from '@auth/guards/auth.guard';
import { Card } from '@card/entity/card.entity';
import { CardService } from '@card/services/card.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('/create')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addCard(@Body() data: Card) {
    const oi = await this.cardService.addCard(data);
    return 'tmj';
  }
}
