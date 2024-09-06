import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('QUIZ_SERVICE') private readonly quizClient: ClientProxy,
    @Inject('SHAKE_SERVICE') private readonly shakeClient: ClientProxy,
  ) {}

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

  async getEventByBrandId(userId: number) {
    const events = await this.prisma.event.findMany({
      where: {
        brands: {
          has: userId,
        },
      },
    });

    return events;
  }

  async getEventWithGameIds(eventId: number) {
    const [quizGameResult, shakeGameResult, eventResult] = await Promise.allSettled([
      firstValueFrom(this.quizClient.send({ cmd: 'get_quiz_game_ids_by_event_id' }, { eventId }).pipe(timeout(50000))),
      firstValueFrom(
        this.shakeClient.send({ cmd: 'get_shake_game_ids_by_event_id' }, { eventId }).pipe(timeout(50000)),
      ),
      this.prisma.event.findFirst({
        where: {
          id: eventId,
        },
      }),
    ]);

    let quizGame = [];
    if (quizGameResult.status === 'fulfilled') {
      quizGame = quizGameResult.value;
    }

    let shakeGame = [];
    if (shakeGameResult.status === 'fulfilled') {
      shakeGame = shakeGameResult.value;
    }

    if (eventResult.status === 'rejected') {
      throw new NotFoundException(`Event with id ${eventId} not found`);
    }

    const event = eventResult.value;

    return {
      id: event.id,
      name: event.name,
      description: event.description,
      beginAt: event.beginAt,
      endAt: event.endAt,
      status: event.status,
      imageUrl: event.imageUrl,
      brands: event.brands,
      quizGameIds: quizGame,
      shakeGameIds: shakeGame,
    };
  }
}
