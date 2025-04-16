import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../config/database.config';
import { DatabaseController } from './controller/database.controller';
import { DatabaseService } from './service/database.service';
import { Order } from './models/order.entity';
import { Product } from './models/product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Product, Order])
  ],
  controllers: [DatabaseController],
  providers: [
    {
      provide: "DatabaseServiceInterface",
      useClass: DatabaseService
    }
  ],
  exports: [],
})
export class DatabaseModule { }
