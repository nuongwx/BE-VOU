import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { InventoryItemService } from './inventory-item.service';
import { InventoryItem } from './entities/inventory-item.entity';
import { CreateInventoryItemInput } from './dto/create-inventory-item.input';
import { UpdateInventoryItemInput } from './dto/update-inventory-item.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Item } from 'src/item/entities/item.entity';

@Resolver(() => InventoryItem)
export class InventoryItemResolver {
  constructor(
    private readonly inventoryItemService: InventoryItemService,
    private readonly prisma: PrismaService,
  ) {}

  @Mutation(() => InventoryItem)
  createInventoryItem(@Args('createInventoryItemInput') createInventoryItemInput: CreateInventoryItemInput) {
    return this.inventoryItemService.create(createInventoryItemInput);
  }

  @Query(() => [InventoryItem], { name: 'inventoryItems' })
  findAll() {
    return this.inventoryItemService.findAll();
  }

  @Query(() => InventoryItem, { name: 'inventoryItem' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.inventoryItemService.findOne(id);
  }

  @Mutation(() => InventoryItem)
  updateInventoryItem(@Args('updateInventoryItemInput') updateInventoryItemInput: UpdateInventoryItemInput) {
    return this.inventoryItemService.update(updateInventoryItemInput.id, updateInventoryItemInput);
  }

  @Mutation(() => InventoryItem)
  removeInventoryItem(@Args('id', { type: () => Int }) id: number) {
    return this.inventoryItemService.remove(id);
  }

  @ResolveField('inventory', () => Inventory, { description: 'Inventory' })
  inventory(@Parent() inventoryItem: InventoryItem) {
    return this.prisma.inventory.findFirstOrThrow({
      where: {
        InventoryItem: {
          some: {
            id: inventoryItem.id,
          },
        },
      },
    });
  }

  @ResolveField('item', () => Item, { description: 'Original Item' })
  item(@Parent() inventoryItem: InventoryItem) {
    return this.prisma.item.findFirstOrThrow({
      where: {
        InventoryItem: {
          some: {
            id: inventoryItem.id,
          },
        },
      },
    });
  }
}
