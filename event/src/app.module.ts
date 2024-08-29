import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { FavouriteModule } from './favourite/favourite.module';
import { PostModule } from './post/post.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import Keyv from 'keyv';
import { PrismaModule } from './prisma/prisma.module';
import KeyvRedis from '@keyv/redis';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: true,
        playground: false,
        debug: true,
        plugins: [
          ApolloServerPluginCacheControl({ defaultMaxAge: 6 }),
          responseCachePlugin(),
          ApolloServerPluginLandingPageLocalDefault(),
        ],
        cache: new KeyvAdapter(new Keyv({ store: new KeyvRedis(configService.get('REDIS_URL')) })),
        introspection: true,
        csrfPrevention: false,
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    EventModule,
    FavouriteModule,
    PostModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
