import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/signUp-input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { SignInInput } from 'src/auth/dto/signIn-input';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }
  async signUp(signUpInput: SignUpInput) {
    const hashedPassword = await argon.hash(signUpInput.password);
    const user = await this.prisma.user.create({
      data: {
        userName: signUpInput.userName,
        email: signUpInput.email,
        hashedPassword: hashedPassword,
        OTP_method: "email", // This is a placeholder for the OTP method
        role: "player", // This is a placeholder for the role
        isActive: true, // This is a placeholder for the isActive
        name: "", // This is a placeholder for the name
        dateOfBirth: new Date(), // This is a placeholder for the dateOfBirth
        sex: "male", // This is a placeholder for the
        phoneNumber: "",
      },
    });
    const {accessToken, refreshToken} = await this.createTokens(
      user.id, 
      user.email
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return {accessToken, refreshToken, user};
  }

  async signIn(signInInput: SignInInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: signInInput.email },
    });
    if (!user) {
      throw new ForbiddenException('Access Denied')
    }
    const doPasswordsMatch = await argon.verify(user.hashedPassword, signInInput.password);
    if (!doPasswordsMatch) {
      throw new ForbiddenException('Access Denied')
    }
    const {accessToken, refreshToken} = await this.createTokens(
      user.id,
      user.email
    );
    await this.updateRefreshToken(user.id, refreshToken);
    return {accessToken, refreshToken, user};
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
    const accessToken = this.jwtService.sign({
      userId,
      email,
    },
      {
        expiresIn: '10s',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      }
    );
    const refreshToken = this.jwtService.sign({
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
        hashedRefreshToken: {not: null},
      },
      data: {
        hashedRefreshToken: null,
      },
    });
    return {loggedOut: true};
  }
}