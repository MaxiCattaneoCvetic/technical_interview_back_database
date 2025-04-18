import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './module_data/database.module';
import { AuthModule } from './shared/auth/auth.module';
import { OrderModule } from './module_order/order.module';
import { OrderController } from './module_order/controller/order.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DatabaseModule,
    AuthModule,
    OrderModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
