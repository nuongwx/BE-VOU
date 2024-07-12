import { Controller } from '@nestjs/common';
import { EventPattern, GrpcMethod, MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { AServiceService } from './a-service.service';
import { CreateAServiceDto } from './dto/create-a-service.dto';
import { UpdateAServiceDto } from './dto/update-a-service.dto';

@Controller()
export class AServiceController {
  constructor(private readonly aServiceService: AServiceService) {}

  @MessagePattern('createAService')
  create(@Payload() createAServiceDto: CreateAServiceDto) {
    return this.aServiceService.create(createAServiceDto);
  }

  @MessagePattern('findAllAService')
  findAll() {
    return this.aServiceService.findAll();
  }

  @MessagePattern('findOneAService')
  findOne(@Payload() id: number) {
    return this.aServiceService.findOne(id);
  }

  @MessagePattern('updateAService')
  update(@Payload() updateAServiceDto: UpdateAServiceDto) {
    return this.aServiceService.update(updateAServiceDto.id, updateAServiceDto);
  }

  @MessagePattern('removeAService')
  remove(@Payload() id: number) {
    return this.aServiceService.remove(id);
  }

  @EventPattern('tcp', Transport.TCP)
  notifyBillions(@Payload() data: any) {
    console.log('TCP Notification: ', data);
  }

  @EventPattern('rmq', Transport.RMQ)
  notifyBillionsRabbit(@Payload() data: any) {
    console.log('Rabbit Notification: ', data);
  }

  @GrpcMethod('NotificationService', 'SendNotification')
  sendNotification(data: any) {
    console.log('GRPC Notification: ', data);
    return { message: 'Notification sent' };
  }
}
