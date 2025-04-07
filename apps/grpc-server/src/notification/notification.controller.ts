import { NotificationResponseDTO, UserDTO } from '@grpc/shared';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class NotificationGrpcController {

  @GrpcMethod('NotificationService', 'run')
  run(user: UserDTO): NotificationResponseDTO {
    const id: number = 1;
    const message: string = `Hello, ${user.name}`;
    const date: string = new Date().toLocaleString();
    return new NotificationResponseDTO(id, message, date);
  }
}
