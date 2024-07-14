import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { User } from '../user/user.model';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: any){
    const hashedPassword = await hash(data.password, 10);
    const user = this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
    return user;
  }

  async login(userName: string, password: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { userName } });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = this.jwtService.sign({ userId: user.id });
    return token;
  }
  
  async forgotPassword(email: string): Promise<void> {
   
  }

  async facebookLogin(facebookAccount: string): Promise<User | null> {
    
    return null; 
  }
}
