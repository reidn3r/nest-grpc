import { GRPCNotificationInterface, UserDTO } from '@grpc/shared';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class NotificationService implements OnModuleInit {
  private grpc: GRPCNotificationInterface;

  constructor(
    @Inject('NOTIFICATION_GRPC_PACKAGE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.grpc = this.client.getService<GRPCNotificationInterface>(
      'NotificationService',
    );
  }

  run(user: UserDTO) {
    return this.grpc.run(user);
  }
}
