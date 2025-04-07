import { Module } from '@nestjs/common';
import { NotificationService } from './notification-service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATION_GRPC_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'interface',
          protoPath: join(process.cwd(), 'src', 'grpc', 'interface.proto'),
        },
      },
    ]),
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
