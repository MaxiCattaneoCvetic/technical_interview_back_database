import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { OrderController } from './controller/order.controller';
import { OrderService } from './service/order.service';
import { Order } from './domain/models/order.entity';
import { AuthModule } from 'src/shared/auth/auth.module';
import { ProductModule } from 'src/module_product/product.module';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Order]),
        ProductModule
    ],
    providers: [
        {
            provide: "OrderServiceInterface",
            useClass: OrderService
        }
    ],
    controllers: [OrderController],
    exports: ['OrderServiceInterface']
})
export class OrderModule { }