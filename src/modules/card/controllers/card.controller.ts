import { Roles } from '@auth/decorators/roles.decorator';
import { Role } from '@auth/enums/role.enum';
import { AuthGuard } from '@auth/guards/auth.guard';
import { updateCardDTO } from '@card/dto/update-card.dto';
import { Card } from '@card/entity/card.entity';
import { CardService } from '@card/services/card.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post('/create')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addCard(@Body() data: Card): Promise<Card> {
    const card: Card = await this.cardService.addCard(data);
    return card;
  }

  @Get('/list')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async listCards(): Promise<Card[]> {
    const cards: Card[] = await this.cardService.listCards();
    return cards;
  }

  @Get('/details/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getCard(@Param('id', new ParseUUIDPipe()) id: string): Promise<Card> {
    const card: Card = await this.cardService.getCard(id);
    return card;
  }

  @Put('/update/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: updateCardDTO,
  ): Promise<Card> {
    const card: Card = await this.cardService.udpateCard(id, data);
    return card;
  }

  @Delete('/delete/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCard(@Param('id') id: string): Promise<void> {
    await this.cardService.deleteCard(id);
  }
}
