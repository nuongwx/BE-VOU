import { Injectable } from '@nestjs/common';
import { CreateAWDto } from './dto/create-a-w.dto';
import { UpdateAWDto } from './dto/update-a-w.dto';

@Injectable()
export class AWsService {
  create(createAWDto: CreateAWDto) {
    return 'This action adds a new aW';
  }

  findAll() {
    return `This action returns all aWs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aW`;
  }

  update(id: number, updateAWDto: UpdateAWDto) {
    return `This action updates a #${id} aW`;
  }

  remove(id: number) {
    return `This action removes a #${id} aW`;
  }
}
