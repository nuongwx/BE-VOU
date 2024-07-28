import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { FacebookStrategy } from 'src/auth/facebook/facebook.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { FirebaseAdminService } from 'src/auth/firebase/firebase-admin-service';

@Module({
  imports: [
    CacheModule.register(),
    PassportModule.register({ defaultStrategy: 'facebook' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' }
    })
  ],
  providers: [AuthResolver, AuthService, JwtService, PrismaService, FacebookStrategy, ConfigService, FirebaseAdminService],
  exports: [AuthService]  

})
export class AuthModule {}
