import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import databaseConfig from './config/database.config';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    RestaurantsModule,
    ConfigModule.forRoot({
      load: [databaseConfig],
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>("database.uri"),
      }),
      inject: [ConfigService],
     }),
     ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10
     }]),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule {}
