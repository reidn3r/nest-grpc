import { Module } from '@nestjs/common';
import { NotificationGrpcController } from './notification.controller';

@Module({
  providers: [NotificationGrpcController],
  controllers: [NotificationGrpcController],
  exports: [NotificationGrpcController],
})
export class NotificationModule {}
