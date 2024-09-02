import { Injectable } from '@nestjs/common';
import { CreateRequestInput } from './dto/create-request.input';
import { UpdateRequestInput } from './dto/update-request.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RequestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRequestInput: CreateRequestInput) {
    const sender = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: createRequestInput.senderId,
      },
    });

    const receiver = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: createRequestInput.receiverId,
      },
    });

    if (sender.gameId !== receiver.gameId) {
      throw new Error('Sender and receiver must be in the same game');
    }

    if (sender.id === receiver.id) {
      throw new Error('Sender and receiver must be different users');
    }

    return this.prisma.request.create({
      data: {
        Sender: {
          connect: {
            id: sender.id,
          },
        },
        Receiver: {
          connect: {
            id: receiver.id,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.request.findMany();
  }

  findOne(id: number) {
    return this.prisma.request.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateRequestInput: UpdateRequestInput) {
    const request = await this.prisma.request.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (request.isAccepted) {
      throw new Error('Request has already been fulfilled');
    }

    const sender = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: request.senderId,
      },
    });

    await this.prisma.user.update({
      where: {
        id: sender.id,
      },
      data: {
        lives: sender.lives + 1,
      },
    });

    return this.prisma.request.update({
      where: {
        id,
      },
      data: {
        isAccepted: updateRequestInput.isAccepted,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}
