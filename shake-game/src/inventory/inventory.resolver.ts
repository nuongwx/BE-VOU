import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryInput } from './dto/create-inventory.input';
import { UpdateInventoryInput } from './dto/update-inventory.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShakeUser } from 'src/user/entities/user.entity';
import { InventoryItem } from 'src/inventory-item/entities/inventory-item.entity';

@Resolver(() => Inventory)
export class InventoryResolver {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => Inventory)
  createInventory(@Args('createInventoryInput') createInventoryInput: CreateInventoryInput) {
    return this.inventoryService.create(createInventoryInput);
  }

  @Query(() => [Inventory], { name: 'inventories' })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Query(() => Inventory, { name: 'inventory' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.inventoryService.findOne(id);
  }

  @Mutation(() => Inventory)
  updateInventory(@Args('updateInventoryInput') updateInventoryInput: UpdateInventoryInput) {
    return this.inventoryService.update(updateInventoryInput.id, updateInventoryInput);
  }

  @Mutation(() => Inventory)
  removeInventory(@Args('id', { type: () => Int }) id: number) {
    return this.inventoryService.remove(id);
  }

  @ResolveField('user', () => ShakeUser, { description: 'User' })
  user(@Parent() inventory: Inventory) {
    return this.prisma.user.findFirstOrThrow({
      where: {
        Inventory: {
          id: inventory.id,
        },
      },
    });
  }

  @ResolveField('items', () => [InventoryItem], { description: 'Items' })
  items(@Parent() inventory: Inventory) {
    return this.prisma.inventoryItem.findMany({
      where: {
        inventoryId: inventory.id,
      },
    });
  }
}
