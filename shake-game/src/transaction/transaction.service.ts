import { Injectable } from '@nestjs/common';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTransactionInput: CreateTransactionInput) {
    const sender = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: createTransactionInput.senderId,
      },
    });

    const receiver = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: createTransactionInput.receiverId,
      },
    });

    if (sender.gameId !== receiver.gameId) {
      throw new Error('Sender and receiver must be in the same game');
    }

    if (sender.id === receiver.id) {
      throw new Error('Sender and receiver must be different users');
    }

    const senderInventory = await this.prisma.inventory.findUniqueOrThrow({
      where: {
        id: sender.inventoryId,
      },
    });

    const receiverInventory = await this.prisma.inventory.findUniqueOrThrow({
      where: {
        id: receiver.inventoryId,
      },
    });

    if (!senderInventory || !receiverInventory) {
      throw new Error('Sender and receiver must have an inventory');
    }

    // check if the sender has the item
    const senderItem = await this.prisma.inventoryItem.findUniqueOrThrow({
      where: {
        Inventory: {
          id: senderInventory.id,
        },
        id: createTransactionInput.itemId,
      },
    });

    // const senderItem = await this.prisma.inventoryItem.findUniqueOrThrow({
    //   where: {
    //     Inventory: {
    //       id: senderInventory.id,
    //     },
    //     itemId: createTransactionInput.itemId,
    //   },
    // });

    if (!senderItem) {
      throw new Error('Sender does not have the item');
    }

    return this.prisma.transaction
      .create({
        data: {
          InventoryItem: {
            connect: {
              id: createTransactionInput.itemId,
            },
          },
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
      })
      .then(() => {
        return this.prisma.inventoryItem.update({
          where: {
            id: createTransactionInput.itemId,
          },
          data: {
            Inventory: {
              connect: {
                id: receiverInventory.id,
              },
            },
          },
        });
      });
  }

  findAll() {
    return this.prisma.transaction.findMany();
  }

  findOne(id: number) {
    return this.prisma.transaction.findUniqueOrThrow({
      where: { id },
    });
  }

  update(id: number, updateTransactionInput: UpdateTransactionInput) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
