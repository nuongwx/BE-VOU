import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('VOUCHER_SERVICE') private readonly voucherClient: ClientProxy,
  ) {}

  create(createGameInput: CreateGameInput) {
    return this.prisma.game.create({
      data: {
        name: createGameInput.name,
        items: {
          create: createGameInput.items,
          connect: createGameInput.itemId.map((id) => ({ id })),
        },
      },
    });
  }

  async findAll(limit?: number, offset?: number) {
    try {
      return await this.prisma.game.findMany({
        take: limit ?? undefined,
        skip: offset ?? undefined,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error finding games');
    }
  }

  findOne(id: number) {
    return this.prisma.game.findUniqueOrThrow({
      where: { id },
    });
  }

  update(id: number, updateGameInput: UpdateGameInput) {
    return this.prisma.game.update({
      where: { id },
      data: {
        name: updateGameInput.name,
        inventId: updateGameInput.eventId,
        items: {
          create: updateGameInput.items,
          connect: updateGameInput.itemId.map((id) => ({ id })),
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.game.delete({
      where: { id },
    });
  }

  async assignVoucherForWinnerUser(shakeGameId: number, userId: number) {
    try {
      const shakeGame = await this.prisma.game.findUnique({
        where: { id: shakeGameId, isDeleted: false },
        select: { eventId: true },
      });

      const eventId = shakeGame.eventId;

      const result = await firstValueFrom(
        this.voucherClient.send({ cmd: 'assign_voucher_to_user' }, { eventId, userId }),
      );

      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error assigning voucher');
    }
  }

  async getShakeGameById(id: number) {
    return await this.prisma.game.findUnique({
      where: { id },
    });
  }

  async findUnassignedGame() {
    const games = await this.prisma.game.findMany({
      where: {
        OR: [{ eventId: null }, { eventId: { lt: 0 } }],
        isDeleted: false,
      },
    });

    return games;
  }
}
