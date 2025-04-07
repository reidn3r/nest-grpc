import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'interface',
        protoPath: join(process.cwd(), 'src', 'grpc', 'interface.proto'),
      },
    },
  );
  await app.listen();
}
bootstrap();
