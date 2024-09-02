import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { JwtRefreshStrategy, JwtStrategy } from './jwt/jwt.strategy';
import { PrismaModule } from './prisma/prisma.module';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import KeyvRedis from '@keyv/redis';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';
import Keyv from 'keyv';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: true,
        context: ({ req }) => ({ req }),
        sortSchema: true,
        playground: false,
        introspection: true,
        debug: true,
        plugins: [
          ApolloServerPluginCacheControl({ defaultMaxAge: 6 }),
          responseCachePlugin(),
          ApolloServerPluginLandingPageLocalDefault(),
        ],
        cache: new KeyvAdapter(
          new Keyv({
            store: new KeyvRedis(configService.get<string>('REDIS_URL')),
          }),
        ),
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [JwtStrategy, JwtRefreshStrategy],
})
export class AppModule {}
