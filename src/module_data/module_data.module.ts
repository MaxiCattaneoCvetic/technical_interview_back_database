import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './models/order.entity';
import { OrderController } from './controller/order.controller';
import { OrderService } from './service/order.service';
import { OrderRepository } from './repository/order.repository';
import { OrderServiceInterface } from './service/order.service.interface';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order])
    ],
    controllers: [OrderController],
    providers: [
        OrderRepository,
        {
            provide: 'OrderServiceInterface',
            useClass: OrderService
        },
        {
            provide: 'OrderRepository',
            useClass: OrderRepository
        }
    ],
    exports: ['OrderServiceInterface']
})
export class ModuleDataModule {} 