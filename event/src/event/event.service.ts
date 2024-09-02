import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  create(createEventInput: CreateEventInput) {
    return this.prisma.event.create({
      data: createEventInput,
    });
  }

  async findAll(limit?: number, offset?: number) {
    try {
      return await this.prisma.event.findMany({
        take: limit ?? undefined,
        skip: offset ?? undefined,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error finding events');
    }
  }

  findOne(id: number) {
    return this.prisma.event.findUniqueOrThrow({
      where: { id },
    });
  }

  update(id: number, updateEventInput: UpdateEventInput) {
    return this.prisma.event.update({
      where: { id },
      data: updateEventInput,
    });
  }

  remove(id: number) {
    return this.prisma.event.delete({
      where: { id },
    });
  }

  async getAllUpcomingEvents() {
    const currentTime = new Date();

    return await this.prisma.event.findMany({
      where: {
        status: 'ACTIVE',
        beginAt: {
          gt: currentTime,
        },
      },
    });
  }

  async getAllOngoingEvents() {
    const currentTime = new Date();

    return await this.prisma.event.findMany({
      where: {
        status: 'ACTIVE',
        beginAt: {
          lte: currentTime,
        },
        endAt: {
          gte: currentTime,
        },
      },
    });
  }
}
