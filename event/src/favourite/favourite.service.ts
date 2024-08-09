import { Injectable } from '@nestjs/common';
import { CreateFavouriteInput } from './dto/create-favourite.input';
import { UpdateFavouriteInput } from './dto/update-favourite.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavouriteService {
  constructor(private readonly prisma: PrismaService) {}

  create(createFavouriteInput: CreateFavouriteInput) {
    return this.prisma.favourite.create({
      data: {
        event: {
          connect: {
            id: createFavouriteInput.eventId,
          },
        },
        userId: createFavouriteInput.userId,
      },
    });
  }

  findAll() {
    return this.prisma.favourite.findMany();
  }

  findOne(id: number) {
    return this.prisma.favourite.findUniqueOrThrow({
      where: { id },
    });
  }

  update(id: number, updateFavouriteInput: UpdateFavouriteInput) {
    return this.prisma.favourite.update({
      where: { id },
      data: {
        event: {
          connect: {
            id: updateFavouriteInput.eventId,
          },
        },
        userId: updateFavouriteInput.userId,
      },
    });
  }

  remove(id: number) {
    return this.prisma.favourite.delete({
      where: { id },
    });
  }
}
