import { Injectable } from '@nestjs/common';
import { CreateShakeUserInput } from './dto/create-user.input';
import { UpdateShakeUserInput } from './dto/update-user.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserInput: CreateShakeUserInput) {
    const lives = await this.prisma.game
      .findUniqueOrThrow({
        where: {
          id: createUserInput.gameId,
        },
      })
      .then((game) => game.lives);

    const exist = await this.prisma.user.findFirst({
      where: {
        authUserId: createUserInput.authUserId,
        gameId: createUserInput.gameId,
      },
    });

    if (exist) {
      return exist;
    }

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
        authUserId: createUserInput.authUserId,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id },
    });
  }

  update(id: number, updateUserInput: UpdateShakeUserInput) {
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
