import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserInput: CreateUserInput) {
    const lives = await this.prisma.game
      .findFirst({
        where: {
          id: createUserInput.gameId,
        },
      })
      .then((game) => game.lives);

    return this.prisma.user.create({
      // connect to game
      data: {
        Game: {
          connect: {
            id: createUserInput.gameId,
          },
        },
        Inventory: {
          create: {},
        },
        lives: lives,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
    });
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return this.prisma.user.update({
      where: { id },
      data: {
        lives: updateUserInput.lives,
      },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
