import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CallsModule } from './modules/calls/calls.module';
import { TwilioModule } from './modules/twilio/twilio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? undefined : 'config.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI', 'mongodb://localhost:27017/twilio_ivr'),
      }),
      inject: [ConfigService],
    }),
    CallsModule,
    TwilioModule,
  ],
})
export class AppModule {} 