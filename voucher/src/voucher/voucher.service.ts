import { Injectable } from '@nestjs/common';
import { CreateVoucherInput } from './dto/create-voucher.input';
import { UpdateVoucherInput } from './dto/update-voucher.input';

@Injectable()
export class VoucherService {
  create(createVoucherInput: CreateVoucherInput) {
    console.log('createVoucherInput', createVoucherInput);
    return 'This action adds a new voucher';
  }

  findAll() {
    return `This action returns all voucher`;
  }

  findOne(id: number) {
    return `This action returns a #${id} voucher`;
  }

  update(id: number, updateVoucherInput: UpdateVoucherInput) {
    console.log(id, updateVoucherInput);
    return `This action updates a #${id} voucher`;
  }

  remove(id: number) {
    return `This action removes a #${id} voucher`;
  }
}
