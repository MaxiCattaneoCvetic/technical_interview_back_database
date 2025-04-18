import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './module_data/database.module';
import { AuthModule } from './shared/auth/auth.module';
import { OrderModule } from './module_order/order.module';
import { ProductModule } from './module_product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DatabaseModule,
    AuthModule,
    OrderModule,
    ProductModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
