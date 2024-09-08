import { Injectable } from '@nestjs/common';
import { CreateRedeemInput } from './dto/create-redeem.input';
import { UpdateRedeemInput } from './dto/update-redeem.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameService } from 'src/game/game.service';

@Injectable()
export class RedeemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameService: GameService,
  ) {}

  async create(createRedeemInput: CreateRedeemInput) {
    // Start a transaction
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: createRedeemInput.userId,
        },
      });

      const game = await prisma.game.findUniqueOrThrow({
        where: {
          id: user.gameId,
        },
      });

      const gameItems = await prisma.item.findMany({
        where: {
          games: {
            some: {
              id: game.id,
            },
          },
        },
      });

      const inventoryItems = await prisma.inventoryItem.findMany({
        where: {
          inventoryId: user.inventoryId,
        },
      });

      // Create a map of inventory items for quick lookup
      const inventoryMap = new Map(inventoryItems.map((item) => [item.itemId, item]));

      // Check if user has enough items to redeem
      // for (const gameItem of gameItems) {
      //   if (!inventoryMap.has(gameItem.id)) {
      //     throw new Error(`User does not have enough items to redeem ${gameItem.id} ${gameItem.name}`);
      //   }
      // }

      gameItems.forEach((gameItem) => {
        if (!inventoryMap.has(gameItem.id)) {
          throw new Error(`User does not have enough items to redeem ${gameItem.id} ${gameItem.name}`);
        }
      });

      // Collect IDs of items to delete
      const inventoryItemIdsToDelete = gameItems.map((gameItem) => inventoryMap.get(gameItem.id).id);

      // Batch delete inventory items
      await prisma.inventoryItem.deleteMany({
        where: {
          id: {
            in: inventoryItemIdsToDelete,
          },
        },
      });

      // Create redeem record
      await prisma.redeem.create({
        data: {
          User: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return this.gameService.assignVoucherForWinnerUser(game.id, user.authUserId);
    });
  }

  findAll() {
    return `This action returns all redeem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} redeem`;
  }

  update(id: number, updateRedeemInput: UpdateRedeemInput) {
    return `This action updates a #${id} redeem`;
  }

  remove(id: number) {
    return `This action removes a #${id} redeem`;
  }
}
