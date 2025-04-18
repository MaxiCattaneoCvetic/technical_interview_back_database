import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";


import { ProductService } from "./service/product.service";
import { Product } from "./domain/models/product.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Product])],

    providers: [{
        provide: 'ProductServiceInterface',
        useClass: ProductService
    }],
    exports: ['ProductServiceInterface']

})
export class ProductModule { }
