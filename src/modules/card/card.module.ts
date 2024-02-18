import { Module } from '@nestjs/common';
import { CardService } from './services/card.service';
import { CardController } from './controllers/card.controller';
import { Card } from './entity/card.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  providers: [CardService],
  controllers: [CardController],
})
export class CardModule {}
