import { updateCardDTO } from '@card/dto/update-card.dto';
import { Card } from '@card/entity/card.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
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
      throw new Error('Error saving card, try again.');
    }
  }

  async getCard(id: string): Promise<Card> {
    const card: Card = await this.cardRepository.findOneBy({ id });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return card;
  }

  async listCards(): Promise<Card[]> {
    const cards: Card[] = await this.cardRepository.find();

    if (!cards.length) {
      throw new NotFoundException('Card not found');
    }

    return cards;
  }
  async udpateCard(id: string, card: updateCardDTO): Promise<Card> {
    let cardFound: Card = await this.cardRepository.findOneBy({ id });

    if (!cardFound) {
      throw new NotFoundException(`Card not found`);
    }

    try {
      cardFound = this.cardRepository.merge(cardFound, card);
      const cardUpdated: Card = await this.cardRepository.save(cardFound);
      return cardUpdated;
    } catch (error) {
      throw new Error('Error when updating card');
    }
  }

  async deleteCard(id: string): Promise<void> {
    let cardFound: Card = await this.cardRepository.findOneBy({ id });

    if (!cardFound) {
      throw new NotFoundException('Card not found`');
    }

    try {
      await this.cardRepository.delete(cardFound.id);
    } catch (error) {
      throw new Error('Error when deleting card');
    }
  }
}
