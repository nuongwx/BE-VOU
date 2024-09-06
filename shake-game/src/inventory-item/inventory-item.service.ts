import { Injectable } from '@nestjs/common';
import { CreateInventoryItemInput } from './dto/create-inventory-item.input';
import { UpdateInventoryItemInput } from './dto/update-inventory-item.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameService } from 'src/game/game.service';

@Injectable()
export class InventoryItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameService: GameService,
  ) {}

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
    }
    if (user.lives < 1) {
      throw new Error('No lives left');
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lives: user.lives > 0 ? user.lives - 1 : 0,
      },
    });

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

    const inventoryItem = await this.prisma.inventoryItem.create({
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

    // create a transaction
    await this.prisma.transaction.create({
      data: {
        InventoryItem: {
          connect: {
            id: inventoryItem.id,
          },
        },
        Sender: {
          connect: {
            id: 1, // TODO: add system user
          },
        },
        Receiver: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    this.gameService.assignVoucherForWinnerUser(user.gameId, user.id);

    return inventoryItem;
  }

  findAll() {
    return this.prisma.inventoryItem.findMany();
  }

  findOne(id: number) {
    return this.prisma.inventoryItem.findUniqueOrThrow({
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

  async getTotalInventory(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.prisma.inventoryItem.aggregate({
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        isDeleted: false,
      },
    });

    return result._count.id || 0;
  }

  async getTotalInventoryPerPlayers(startDate: Date, endDate: Date, userId: number): Promise<number> {
    const result = await this.prisma.inventoryItem.aggregate({
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        Inventory: {
          User: {
            id: userId,
            isDeleted: false,
          },
        },
        isDeleted: false,
      },
    });

    return result._count.id || 0;
  }
}
