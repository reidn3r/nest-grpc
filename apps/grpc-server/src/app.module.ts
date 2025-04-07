import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [AppService],
  exports: [NotificationModule],
})
export class AppModule {}
