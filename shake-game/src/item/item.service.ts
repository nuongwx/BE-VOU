import { Injectable } from '@nestjs/common';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  create(createItemInput: CreateItemInput) {
    return this.prisma.item.create({
      data: createItemInput,
    });
  }

  findAll() {
    return this.prisma.item.findMany();
  }

  findOne(id: number) {
    return this.prisma.item.findFirst({
      where: { id },
    });
  }

  update(id: number, updateItemInput: UpdateItemInput) {
    return this.prisma.item.update({
      where: { id },
      data: updateItemInput,
    });
  }

  remove(id: number) {
    return this.prisma.item.delete({
      where: { id },
    });
  }
}
