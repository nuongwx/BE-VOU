import { Injectable } from '@nestjs/common';
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

  findAll() {
    return this.prisma.event.findMany();
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
}
