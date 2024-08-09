import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';
import { Inject } from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { InventoryItem } from 'src/inventory-item/entities/inventory-item.entity';

interface SendNotificationRequest {
  message: string;
}

interface SendNotificationResponse {
  message: string;
}

interface NotificationService {
  sendNotification(data: SendNotificationRequest): Observable<SendNotificationResponse>;
}

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly prisma: PrismaService,
    // @Inject('NOTIFICATION_SERVICE_TCP') private readonly tcp: ClientProxy,
    // @Inject('NOTIFICATION_SERVICE_RMQ') private readonly rmq: ClientProxy,
    // @Inject('NOTIFICATION_SERVICE_GRPC') private readonly grpc: ClientGrpc,
  ) {}

  // private grpcService: NotificationService;

  onModuleInit() {
    // this.grpcService = this.grpc.getService<NotificationService>('NotificationService');
  }

  @Mutation(() => Transaction)
  createTransaction(@Args('createTransactionInput') createTransactionInput: CreateTransactionInput) {
    return this.transactionService.create(createTransactionInput);
  }

  @Query(() => [Transaction], { name: 'transactions' })
  findAll() {
    // console.log('New transaction created');
    // this.tcp.emit('tcp', { message: 'TCP New transaction created' });
    // this.rmq.emit('rmq', { message: 'RabbitMQ New transaction created' });
    // this.grpcService.sendNotification({ message: 'GRPC New transaction created' }).subscribe((data) => {
    //   console.log(data);
    // });
    return this.transactionService.findAll();
  }

  @Query(() => Transaction, { name: 'transaction' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.transactionService.findOne(id);
  }

  @Mutation(() => Transaction)
  updateTransaction(@Args('updateTransactionInput') updateTransactionInput: UpdateTransactionInput) {
    return this.transactionService.update(updateTransactionInput.id, updateTransactionInput);
  }

  @Mutation(() => Transaction)
  removeTransaction(@Args('id', { type: () => Int }) id: number) {
    return this.transactionService.remove(id);
  }

  @ResolveField('sender', () => User, { description: 'Sender' })
  sender(@Parent() transaction: Transaction) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id: transaction.senderId,
      },
    });
  }

  @ResolveField('receiver', () => User, { description: 'Receiver' })
  receiver(@Parent() transaction: Transaction) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id: transaction.receiverId,
      },
    });
  }

  @ResolveField('inventoryItem', () => InventoryItem, { description: 'Inventory Item' })
  inventoryItem(@Parent() transaction: Transaction) {
    return this.prisma.inventoryItem.findUniqueOrThrow({
      where: {
        id: transaction.inventoryItemId,
      },
    });
  }
}
