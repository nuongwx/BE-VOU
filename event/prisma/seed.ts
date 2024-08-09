import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const event1 = await prisma.event.create({
    data: {
      name: 'Event 1',
      description: 'Event 1 Description',
      beginAt: new Date(),
      endAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
    },
  });

  const event2 = await prisma.event.create({
    data: {
      name: 'Event 2',
      description: 'Event 2 Description',
      beginAt: new Date(),
      endAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
    },
  });

  const event3 = await prisma.event.create({
    data: {
      name: 'Event 3',
      description: 'Event 3 Description',
      beginAt: new Date(),
      endAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
    },
  });

  const post11 = await prisma.post.create({
    data: {
      title: 'Post 11',
      content: 'Post 11 Content',
      status: 'PUBLISHED',
      event: {
        connect: {
          id: event1.id,
        },
      },
    },
  });

  const post12 = await prisma.post.create({
    data: {
      title: 'Post 12',
      content: 'Post 12 Content',
      status: 'ARCHIVED',
      event: {
        connect: {
          id: event1.id,
        },
      },
    },
  });

  const post21 = await prisma.post.create({
    data: {
      title: 'Post 21',
      content: 'Post 21 Content',
      status: 'PUBLISHED',
      event: {
        connect: {
          id: event2.id,
        },
      },
    },
  });

  const post22 = await prisma.post.create({
    data: {
      title: 'Post 22',
      content: 'Post 22 Content',
      status: 'PUBLISHED',
      event: {
        connect: {
          id: event2.id,
        },
      },
    },
  });

  const post23 = await prisma.post.create({
    data: {
      title: 'Post 23',
      content: 'Post 23 Content',
      status: 'DRAFT',
      event: {
        connect: {
          id: event2.id,
        },
      },
    },
  });

  const post31 = await prisma.post.create({
    data: {
      title: 'Post 31',
      content: 'Post 31 Content',
      status: 'PUBLISHED',
      event: {
        connect: {
          id: event3.id,
        },
      },
    },
  });

  const favourite11 = await prisma.favourite.create({
    data: {
      event: {
        connect: {
          id: event1.id,
        },
      },
      userId: 1,
    },
  });

  const favourite12 = await prisma.favourite.create({
    data: {
      event: {
        connect: {
          id: event1.id,
        },
      },
      userId: 2,
    },
  });

  const favourite13 = await prisma.favourite.create({
    data: {
      event: {
        connect: {
          id: event1.id,
        },
      },
      userId: 3,
    },
  });

  const favourite21 = await prisma.favourite.create({
    data: {
      event: {
        connect: {
          id: event2.id,
        },
      },
      userId: 1,
    },
  });

  console.log({
    event1,
    event2,
    event3,
    post11,
    post12,
    post21,
    post22,
    post23,
    post31,
    favourite11,
    favourite12,
    favourite13,
    favourite21,
  });
}
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
