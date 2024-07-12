import { Injectable } from '@nestjs/common';
import { CreateAServiceDto } from './dto/create-a-service.dto';
import { UpdateAServiceDto } from './dto/update-a-service.dto';

@Injectable()
export class AServiceService {
  create(createAServiceDto: CreateAServiceDto) {
    return 'This action adds a new aService';
  }

  findAll() {
    return `This action returns all aService`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aService`;
  }

  update(id: number, updateAServiceDto: UpdateAServiceDto) {
    return `This action updates a #${id} aService`;
  }

  remove(id: number) {
    return `This action removes a #${id} aService`;
  }
}
