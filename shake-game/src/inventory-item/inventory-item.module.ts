import { Module } from '@nestjs/common';
import { InventoryItemService } from './inventory-item.service';
import { InventoryItemResolver } from './inventory-item.resolver';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [GameModule],
  providers: [InventoryItemResolver, InventoryItemService],
})
export class InventoryItemModule {}
