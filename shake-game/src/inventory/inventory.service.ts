import { Injectable } from '@nestjs/common';
import { CreateInventoryInput } from './dto/create-inventory.input';
import { UpdateInventoryInput } from './dto/update-inventory.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  create(createInventoryInput: CreateInventoryInput) {
    return this.prisma.inventory.create({
      data: {
        User: {
          connect: {
            id: createInventoryInput.userId,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.inventory.findMany();
  }

  findOne(id: number) {
    return this.prisma.inventory.findFirst({
      where: {
        id: id,
      },
    });
  }

  update(id: number, updateInventoryInput: UpdateInventoryInput) {
    return this.prisma.inventory.update({
      where: {
        id: id,
      },
      data: {
        User: {
          connect: {
            id: updateInventoryInput.userId,
          },
        },
        InventoryItem: {
          create: updateInventoryInput.items,
        },
      },
    });
  }

  remove(id: number) {
    this.prisma.inventoryItem.deleteMany({
      where: {
        inventoryId: id,
      },
    });
  }
}
