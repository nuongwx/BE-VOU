import { Module } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { FavouriteResolver } from './favourite.resolver';

@Module({
  providers: [FavouriteResolver, FavouriteService],
})
export class FavouriteModule {}
