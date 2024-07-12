import { Module } from '@nestjs/common';
import { InventoryItemService } from './inventory-item.service';
import { InventoryItemResolver } from './inventory-item.resolver';

@Module({
  providers: [InventoryItemResolver, InventoryItemService],
})
export class InventoryItemModule {}
