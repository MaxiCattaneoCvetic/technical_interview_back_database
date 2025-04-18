import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { OrderController } from './controller/order.controller';
import { OrderService } from './service/order.service';
import { Order } from './models/order.entity';
import { AuthModule } from 'src/shared/auth/auth.module';

@Module({
    imports: [
        AuthModule,
        TypeOrmModule.forFeature([Order])
    ],
    providers: [
        {
            provide: "OrderServiceInterface",
            useClass: OrderService
        }
    ],
    controllers: [OrderController],


})
export class OrderModule { }