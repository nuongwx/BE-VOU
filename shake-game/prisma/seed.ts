import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const item1 = await prisma.item.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Item 1' },
  });

  const item2 = await prisma.item.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Item 2' },
  });

  const item3 = await prisma.item.upsert({
    where: { id: 3 },
    update: {},
    create: { name: 'Item 3' },
  });

  const game1 = await prisma.game.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Game 1',
      items: {
        connectOrCreate: [
          { where: { id: 1 }, create: { name: 'Item 1' } },
          { where: { id: 2 }, create: { name: 'Item 2' } },
        ],
      },
    },
  });

  const game2 = await prisma.game.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Game 2',
      items: {
        connectOrCreate: [
          { where: { id: 2 }, create: { name: 'Item 2' } },
          { where: { id: 3 }, create: { name: 'Item 3' } },
        ],
      },
    },
  });

  const user1 = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      Game: {
        connect: { id: 1 },
      },
      Inventory: {
        create: {},
      },
    },
  });

  const user2 = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      Game: {
        connect: { id: 2 },
      },
      Inventory: {
        create: {},
      },
    },
  });

  const inventory_item1 = await prisma.inventoryItem.upsert({
    where: { id: 1 },
    update: {},
    create: {
      Item: { connect: { id: item1.id } },
      Inventory: { connect: { id: user1.inventoryId } },
    },
  });

  const inventory_item2 = await prisma.inventoryItem.upsert({
    where: { id: 2 },
    update: {},
    create: {
      Item: { connect: { id: item2.id } },
      Inventory: { connect: { id: user1.inventoryId } },
    },
  });

  console.log({
    item1,
    item2,
    item3,
    game1,
    game2,
    user1,
    user2,
    inventory_item1,
    inventory_item2,
  });
}
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
