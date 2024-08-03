import { ForbiddenException, Inject, Injectable, BadRequestException } from '@nestjs/common';
import { SignUpInput } from './dto/signUp-input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { SignInInput } from 'src/auth/dto/signIn-input';
import { FirebaseAdminService } from 'src/auth/firebase/firebase-admin-service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private firebaseAdminService: FirebaseAdminService
  ) { }

  async signUp(signUpInput: SignUpInput) {
    const hashedPassword = await argon.hash(signUpInput.password);
    const user = await this.prisma.user.create({
      data: {
        userName: signUpInput.userName,
        email: signUpInput.email,
        hashedPassword: hashedPassword,
        phoneNumber: signUpInput.phoneNumber,
        isActive: false,
        name: "",
        dateOfBirth: new Date(),
        sex: "male",
        OTP_method: "phone",
        role: "player",
      },
    });

    const otpSession = await this.firebaseAdminService.sendOTP(signUpInput.phoneNumber);

    return { otpSession };
  }

  async verifyOtp(phoneNumber: string, otpSession: string) {
    const isValid = await this.firebaseAdminService.verifyOTP(otpSession);
    if (!isValid) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.prisma.user.update({
      where: { phoneNumber: phoneNumber },
      data: { isActive: true },
    });

    return { message: 'OTP verified successfully' };
  }

  async signIn(signInInput: SignInInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: signInInput.email },
    });
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }
    const doPasswordsMatch = await argon.verify(user.hashedPassword, signInInput.password);
    if (!doPasswordsMatch) {
      throw new ForbiddenException('Access Denied');
    }
    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken, user };
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async createTokens(userId: number, email: string) {
    const accessToken = this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: '10s',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      }
    );
    const refreshToken = this.jwtService.sign(
      {
        userId,
        email,
        accessToken,
      },
      {
        expiresIn: '7d',
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      }
    );
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hashedRefreshToken,
      },
    });
  }

  async logOut(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: { not: null },
      },
      data: {
        hashedRefreshToken: null,
      },
    });
    return { loggedOut: true };
  }

  async facebookLogin(req) {
    if (!req.user) {
      throw new ForbiddenException("No user from Facebook");
    }

    const { email, firstName, lastName } = req.user;
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          userName: `${firstName} ${lastName}`,
          OTP_method: "email", // Placeholder for the OTP method
          role: "player", // Placeholder for the role
          isActive: true, // Placeholder for the isActive
          name: "", // Placeholder for the name
          dateOfBirth: new Date(), // Placeholder for the dateOfBirth
          sex: "male", // Placeholder for the sex
          phoneNumber: "",
          hashedPassword: ""
        },
      });
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: "User information from Facebook",
      user,
      accessToken,
    };
  }
}
