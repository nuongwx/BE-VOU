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
import * as nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import { admin } from './firebase/firebase-admin-setup';

@Injectable()
export class AuthService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    });
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private firebaseAdminService: FirebaseAdminService
  ) {}

  async signUp(signUpInput: SignUpInput) {
    const hashedPassword = await argon.hash(signUpInput.password);
    const user = await this.prisma.user.create({
      data: {
        userName: signUpInput.userName,
        email: signUpInput.email,
        hashedPassword,
        phoneNumber: signUpInput.phoneNumber,
        isActive: false,
        role: 'player',
        OTP_method: 'email',
        sex: 'male',
        dateOfBirth: new Date(),
        name: '',
      },
    });

    try {
      const userRecord = await admin.auth().createUser({
        phoneNumber: signUpInput.phoneNumber,
      });
      return { otpSession: userRecord.uid };
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP');
    }
  }

  

  async verifyOtp(phoneNumber: string, otpSession: string, otpCode: string) {
    try {
      const userRecord = await admin.auth().getUserByPhoneNumber(phoneNumber);
      if (userRecord.uid === otpSession) {
        // Assuming otpCode is correct (you should verify it in production)
        await this.prisma.user.update({
          where: { phoneNumber },
          data: { isActive: true },
        });

        return { message: 'OTP verified successfully' };
      } else {
        throw new BadRequestException('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new BadRequestException('Invalid OTP');
    }
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

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('Email not found');
    }

    const resetToken = randomBytes(32).toString('hex');
    const hashedResetToken = await argon.hash(resetToken);

    await this.prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: hashedResetToken,
        passwordResetExpires: new Date(Date.now() + 3600000), // Token valid for 1 hour
      },
    });

    await this.transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: `Your password reset token is: ${resetToken}`,
    });

    return { message: 'Password reset token sent' };
  }

  async verifyPasswordResetToken(email: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const isTokenValid = await argon.verify(user.passwordResetToken, token);
    if (!isTokenValid || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    return { email };
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const isTokenValid = await argon.verify(user.passwordResetToken, token);
    if (!isTokenValid || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await argon.hash(newPassword);

    await this.prisma.user.update({
      where: { email },
      data: {
        hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return { message: 'Password reset successfully' };
  }
}
