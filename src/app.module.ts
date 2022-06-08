import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GENERATE_PDF_NAME } from './constants';
import Bull from 'bull';
import config from './config';
import { AppProcessor } from './app.processor';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    BullModule.registerQueueAsync({
      name: GENERATE_PDF_NAME,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: configService.get<Bull.QueueOptions['redis']>('redis'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppProcessor],
})
export class AppModule {}
