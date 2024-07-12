import { Injectable } from '@nestjs/common';
import { CreateInventoryItemInput } from './dto/create-inventory-item.input';
import { UpdateInventoryItemInput } from './dto/update-inventory-item.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InventoryItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInventoryItemInput: CreateInventoryItemInput) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: createInventoryItemInput.userId,
      },
    });

    if (createInventoryItemInput.itemId) {
      return this.prisma.inventoryItem.create({
        data: {
          Item: {
            connect: {
              id: createInventoryItemInput.itemId,
            },
          },
          amount: createInventoryItemInput.amount,
          Inventory: {
            connect: {
              id: user.inventoryId,
            },
          },
        },
      });
    } else {
      // create a random item depending on the game

      const items = await this.prisma.item.findMany({
        where: {
          games: {
            some: {
              id: user.gameId,
            },
          },
        },
      });

      const randomItem = items[Math.floor(Math.random() * items.length)];

      return this.prisma.inventoryItem.create({
        data: {
          Item: {
            connect: {
              id: randomItem.id,
            },
          },
          amount: 1,
          Inventory: {
            connect: {
              id: user.inventoryId,
            },
          },
        },
      });
    }
  }

  findAll() {
    return this.prisma.inventoryItem.findMany();
  }

  findOne(id: number) {
    return this.prisma.inventoryItem.findFirst({
      where: { id },
    });
  }

  update(id: number, updateInventoryItemInput: UpdateInventoryItemInput) {
    return this.prisma.inventoryItem.update({
      where: { id },
      data: updateInventoryItemInput,
    });
  }

  remove(id: number) {
    return this.prisma.inventoryItem.delete({
      where: { id },
    });
  }
}
