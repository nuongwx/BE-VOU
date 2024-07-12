import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ARestService } from './a-rest.service';
import { CreateARestDto } from './dto/create-a-rest.dto';
import { UpdateARestDto } from './dto/update-a-rest.dto';

@Controller('a-rest')
export class ARestController {
  constructor(private readonly aRestService: ARestService) {}

  @Post()
  create(@Body() createARestDto: CreateARestDto) {
    return this.aRestService.create(createARestDto);
  }

  @Get()
  findAll() {
    return this.aRestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aRestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateARestDto: UpdateARestDto) {
    return this.aRestService.update(+id, updateARestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aRestService.remove(+id);
  }
}
