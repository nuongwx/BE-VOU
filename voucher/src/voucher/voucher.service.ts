import { CreateVoucherInput } from './dto/create-voucher.input';
import { UpdateVoucherInput } from './dto/update-voucher.input';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VoucherStatus } from '@prisma/client';

@Injectable()
export class VoucherService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVoucherInput: CreateVoucherInput) {
    try {
      const result = await this.prisma.voucher.create({
        data: createVoucherInput,
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error creating voucher');
    }
  }

  async addVoucherToUser(voucherId: number, userId: number, qr_code: string) {
    try {
      const voucher = await this.prisma.voucher.findUnique({
        where: { id: voucherId },
      });

      // find user here
      const user = true;

      if (!voucher || !user) {
        throw new NotFoundException('Invalid input');
      }

      return await this.prisma.voucherLine.create({
        data: {
          voucher: {
            connect: {
              id: voucher.id,
            },
          },
          qr_code: qr_code,
          userId: userId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error creating voucher');
    }
  }

  async findAll() {
    try {
      return await this.prisma.voucher.findMany();
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving vouchers');
    }
  }

  async findOne(id: number) {
    try {
      const voucher = await this.prisma.voucher.findUnique({
        where: { id: id },
      });

      if (!voucher) {
        throw new NotFoundException('Voucher not found');
      }

      return voucher;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving voucher');
    }
  }

  async update(id: number, updateVoucherInput: UpdateVoucherInput) {
    try {
      const existingvoucher = await this.prisma.voucher.findUnique({
        where: { id: id },
      });

      if (!existingvoucher) {
        throw new NotFoundException('Voucher not found');
      }

      return await this.prisma.voucher.update({
        where: { id: id },
        data: updateVoucherInput,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating voucher');
    }
  }

  async removeVoucher(id: number) {
    try {
      const existingvoucher = await this.prisma.voucher.findUnique({
        where: { id: id },
      });

      if (!existingvoucher) {
        throw new NotFoundException('Voucher not found');
      }

      return await this.prisma.voucher.delete({
        where: { id: id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting voucher');
    }
  }

  async removeVoucherFromUser(voucherId: number, userId: number) {
    {
      try {
        const voucherLine = await this.prisma.voucherLine.findFirst({
          where: {
            userId: userId,
            voucherId: voucherId,
          },
        });

        if (!voucherLine) {
          throw new NotFoundException('Voucher not found');
        }

        return await this.prisma.voucherLine.delete({
          where: {
            id: voucherLine.id,
          },
        });
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('Error deleting voucher');
      }
    }
  }

  async findAllVoucherExpired() {
    try {
      return await this.prisma.voucher.findMany({
        where: {
          status: { equals: VoucherStatus.INVALID },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving vouchers');
    }
  }

  async findVoucherByUser(userId: number) {
    try {
      return await this.prisma.voucherLine.findMany({
        where: {
          userId: { equals: userId },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving vouchers');
    }
  }

  async findVoucherUsedByUser(userId: number) {
    try {
      return await this.prisma.voucherLine.findMany({
        where: {
          userId: { equals: userId },
          status: { equals: VoucherStatus.USED },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving vouchers');
    }
  }

  async findVoucherExpiredByUser(userId: number) {
    try {
      return await this.prisma.voucherLine.findMany({
        where: {
          userId: { equals: userId },
          status: { equals: VoucherStatus.INVALID },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving vouchers');
    }
  }
}
