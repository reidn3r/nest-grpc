import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { NotificationService } from './notification/notification-service';
import { UserDTO } from '@grpc/shared';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get()
  ping(): string {
    return this.appService.ping();
  }

  @Get('/notification')
  async run(@Query() user: UserDTO) {
    return this.notificationService.run(user);
  }
}
