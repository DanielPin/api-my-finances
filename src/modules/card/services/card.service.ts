import { Card } from '@card/entity/card.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async addCard(card: Card): Promise<Card> {
    try {
      const savedCard: Card = await this.cardRepository.save(card);
      return savedCard;
    } catch (error) {
      throw new Error('Erro ao salvar cartão no banco de dados');
    }
  }

  async udpateCard() {}

  async removeCard() {}
}
