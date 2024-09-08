import {
  ForbiddenException,
  Inject,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { SignUpInput } from './dto/signUp-input';
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
    private firebaseAdminService: FirebaseAdminService,
  ) {}

  async signUp(signUpInput: SignUpInput) {
    const hashedPassword = await argon.hash(signUpInput.password);

    // await admin.auth().createUser({
    //     email: signUpInput.email,
    //     password: signUpInput.password,
    // });
    const userExists = await this.prisma.user.findUnique({
      where: { email: signUpInput.email },
    });
    if (userExists) {
      throw new BadRequestException('Email already exists');
    }

    const userRole = signUpInput.role === 'staff' ? 'staff' : 'player';
    const user = await this.prisma.user.create({
      data: {
        email: signUpInput.email,
        hashedPassword,
        role: userRole,
        isActive: false,
        name: '',
      },
    });

    await admin.auth().createUser({
      email: signUpInput.email,
    });

    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );

    return { accessToken, refreshToken, user };

    // try {
    //   const userRecord = await admin.auth().createUser({
    //     phoneNumber: signUpInput.phoneNumber,
    //   });
    //   return { otpSession: userRecord.uid };
    // } catch (error) {
    //   console.error('Error sending OTP:', error);
    //   throw new Error('Failed to send OTP');
    // }
  }

  async verifyPhone(phoneNumber: string, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { phoneNumber } });
    if (user && user.id !== userId) {
      throw new BadRequestException('Phone number already linked');
    }

    const firebaseUser = await admin.auth().getUserByPhoneNumber(phoneNumber);
    if (!firebaseUser) {
      throw new BadRequestException('Phone number not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        phoneNumber: phoneNumber,
        isActive: true,
        firebaseUID: firebaseUser.uid,
      },
    });

    return user;
  }

  async signIn(signInInput: SignInInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: signInInput.email },
    });
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }
    const doPasswordsMatch = await argon.verify(
      user.hashedPassword,
      signInInput.password,
    );
    if (!doPasswordsMatch) {
      throw new ForbiddenException('Access Denied');
    }
    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );
    return { accessToken, refreshToken, user };
  }

  //   findOne(id: number) {
  //     return `This action returns a #${id} auth`;
  //   }

  //   update(id: number, updateAuthInput: UpdateAuthInput) {
  //     return `This action updates a #${id} auth`;
  //   }

  //   remove(id: number) {
  //     return `This action removes a #${id} auth`;
  //   }

  async createTokens(userId: number, email: string) {
    const accessToken = this.jwtService.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: '5s',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      },
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
      },
    );

    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hashedRefreshToken,
      },
    });
    return { accessToken, refreshToken };
  }

  async updateRefreshToken(oldAccessToken: string, oldRefreshToken: string) {
    const payload = this.jwtService.verify(oldRefreshToken, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
    });
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user || !user.hashedRefreshToken) {
      throw new ForbiddenException('Access Denied: User not found');
    }
    const isRefreshTokenValid = await argon.verify(
      user.hashedRefreshToken,
      oldRefreshToken,
    );
    if (!isRefreshTokenValid) {
      throw new ForbiddenException('Access Denied: Invalid refresh token');
    }
    const { accessToken, refreshToken } = await this.createTokens(
      user.id,
      user.email,
    );
    if (oldAccessToken !== payload.accessToken) {
      throw new ForbiddenException('Access Denied: Invalid access token');
    }
    return { accessToken, refreshToken, user };
  }

  async logOut(userId: number) {
    await this.prisma.user
      .update({
        where: {
          id: userId,
          hashedRefreshToken: { not: null },
        },
        data: {
          hashedRefreshToken: null,
        },
      })
      .catch(() => {
        throw new ForbiddenException('Access Denied');
      });
    return { loggedOut: true };
  }

  async facebookLogin(req) {
    if (!req.user) {
      throw new ForbiddenException('No user from Facebook');
    }

    const { email, firstName, lastName } = req.user;
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          userName: `${firstName} ${lastName}`,
          OTP_method: 'email', // Placeholder for the OTP method
          role: 'player', // Placeholder for the role
          isActive: true, // Placeholder for the isActive
          name: '', // Placeholder for the name
          dateOfBirth: new Date(), // Placeholder for the dateOfBirth
          sex: 'male', // Placeholder for the sex
          phoneNumber: '',
          hashedPassword: '',
        },
      });
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'User information from Facebook',
      user,
      accessToken,
    };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('Email not found');
    }

    // const resetToken = randomBytes(32).toString('hex');
    // const hashedResetToken = await argon.hash(resetToken);

    // random 6 digit number
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetToken = resetToken;

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

    return 'Password reset token sent';
  }

  async verifyPasswordResetToken(email: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // const isTokenValid = await argon.verify(user.passwordResetToken, token);
    // if (!isTokenValid || user.passwordResetExpires < new Date()) {
    //   throw new BadRequestException('Invalid or expired reset token');
    // }

    const isTokenValid = user.passwordResetToken === token;
    if (!isTokenValid || user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    await this.prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return { email };
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // const isTokenValid = await argon.verify(user.passwordResetToken, token);
    // if (!isTokenValid || user.passwordResetExpires < new Date()) {
    //   throw new BadRequestException('Invalid or expired reset token');
    // }

    const isTokenValid = user.passwordResetToken === token;
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

    return 'Password reset successfully';
  }

  async validateToken(token: string) {
    try {
      const user = this.jwtService.verify(token);
      return { user, valid: true };
    } catch (error) {
      return { valid: false };
    }
  }
}
