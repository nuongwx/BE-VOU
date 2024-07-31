import { Injectable } from '@nestjs/common';
import { CreateGameInput } from './dto/create-game.input';
import { UpdateGameInput } from './dto/update-game.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

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

  findAll() {
    return this.prisma.game.findMany();
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
}
