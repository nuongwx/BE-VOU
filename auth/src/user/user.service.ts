import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async getUser(userId: number) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({ data });
  }

  async updateUser(userId: number, data: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async deleteUser(userId: number) {
    return await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  async activateUser(userId: number) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });
  }

  async deactivateUser(userId: number) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }

  async getAllPlayers() {
    return await this.prisma.user.findMany({
      where: { role: 'player' },
    });
  }

  async getAllBrands() {
    return await this.prisma.user.findMany({
      where: { role: 'staff' },
    });
  }

  async getBrandById(brandId: number) {
    return await this.prisma.user.findUnique({
      where: { id: brandId },
    });
  }
}
