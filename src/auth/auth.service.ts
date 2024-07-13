import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '.prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { userName: username },
    });
    if (user && user.password === pass) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.userName, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(newUser: Partial<User>): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { userName: newUser.userName },
    });
  
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
  
    return this.prisma.user.create({
      data: {
        ...newUser,
        userName: newUser.userName || '',
        password: newUser.password || '',
        email: newUser.email || '',
        id: undefined,
        name: newUser.name || '',
        phoneNumber: newUser.phoneNumber || '',
        avatar: newUser.avatar || '',
        role: newUser.role || 'admin'
      },
    });
  }
}
