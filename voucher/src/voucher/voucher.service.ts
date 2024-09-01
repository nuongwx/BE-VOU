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

  async assignVoucherToUser(eventId: number, userId: number) {
    try {
      const voucher = await this.prisma.voucher.findFirst({
        where: {
          eventId: eventId,
          status: 'VALID',
          endTime: {
            gt: new Date(),
          },
        },
      });

      if (!voucher) {
        throw new Error('No valid voucher available for this event.');
      }

      // Pls generate a QR code here
      const qr_code = '';

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
      console.error(error);
      throw new InternalServerErrorException('Error assigning voucher');
    }
  }

  async findVoucherNotUsedByUser(userId: number) {
    try {
      return await this.prisma.voucherLine.findMany({
        where: {
          userId: { equals: userId },
          status: { equals: VoucherStatus.VALID },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving vouchers');
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

  async updateUserVoucherStatus(userId: number, status: VoucherStatus) {
    try {
      const existingvoucherLine = await this.prisma.voucherLine.findUnique({
        where: { id: userId },
      });

      if (!existingvoucherLine) {
        throw new NotFoundException('Voucher not found');
      }

      return await this.prisma.voucherLine.update({
        where: { id: userId },
        data: { status: status },
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

  async findOneUserVoucher(voucherId: number) {
    try {
      return await this.prisma.voucherLine.findFirst({
        where: {
          id: voucherId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving voucher');
    }
  }

  async findVoucherByEvent(eventId: number) {
    try {
      return await this.prisma.voucher.findMany({
        where: {
          eventId: { equals: eventId },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving vouchers');
    }
  }

  async findExpiredVoucherByEvent(eventId: number) {
    try {
      return await this.prisma.voucher.findMany({
        where: {
          eventId: { equals: eventId },
          status: VoucherStatus.INVALID,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving vouchers');
    }
  }

  async findUsedVoucherByEvent(eventId: number) {
    try {
      return await this.prisma.voucher.findMany({
        where: {
          eventId: { equals: eventId },
          status: VoucherStatus.USED,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving vouchers');
    }
  }

  async findValidVoucherByEvent(eventId: number) {
    try {
      return await this.prisma.voucher.findMany({
        where: {
          eventId: { equals: eventId },
          status: VoucherStatus.VALID,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving vouchers');
    }
  }

  async findExpiredVoucher()
  {
    try {
      return await this.prisma.voucher.findMany({
        where: {
          status: VoucherStatus.INVALID,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving vouchers');
    }
  }

  async findValidVoucher()
  {
    try {
      return await this.prisma.voucher.findMany({
        where: {
          status: VoucherStatus.VALID,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving vouchers');
    }
  }

  async findUsedVoucher()
  {
    try {
      return await this.prisma.voucher.findMany({
        where: {
          status: VoucherStatus.USED,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving vouchers');
    }
  }

  async useVoucher(voucherId: number, userId: number, qr_code: string) {
    try {
      const voucherLine = await this.prisma.voucherLine.findFirst({
        where: {
          userId: userId,
          voucherId: voucherId,
          qr_code: qr_code,
          status: VoucherStatus.VALID,
        },
      });

      if (!voucherLine) {
        throw new NotFoundException('Voucher not found');
      }

      return await this.prisma.voucherLine.update({
        where: {
          id: voucherLine.id,
        },
        data: {
          status: VoucherStatus.USED,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error using voucher');
    }
  }

  async giftVoucher(voucherId: number, from_user: number, to_user: number) {
    try {
      const voucherLine = await this.prisma.voucherLine.findFirst({
        where: {
          userId: from_user,
          voucherId: voucherId,
          status: VoucherStatus.VALID,
        },
      });

      if (!voucherLine) {
        throw new NotFoundException('Voucher not found');
      }

      const voucherTrans = await this.prisma.voucherTrans.create({
        data: {
          voucher: {
            connect: {
              id: voucherId,
            },
          },
          from_user: from_user,
          to_user: to_user,
        },
      });

      await this.prisma.voucherLine.update({
        where: {
          id: voucherLine.id,
        },
        data: {
          status: VoucherStatus.INVALID,
          updatedAt: new Date(),
        },
      });

      return {
        message: 'Voucher gifted successfully',
        voucherInfo: this.prisma.voucherLine.create({
          data: {
            voucher: {
              connect: {
                id: voucherId,
              },
            },
            userId: to_user,
            qr_code: voucherLine.qr_code,
            status: VoucherStatus.VALID,
          },
        }),
        voucherTrans: voucherTrans,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error using voucher');
    }
  }
}
