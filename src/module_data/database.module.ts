import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseConfig } from '../config/database.config';
import { DatabaseService } from './service/database.service';
import { Product } from './models/product.entity';
import { InitController } from './controller/init.controller';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/shared/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Product]),
    AuthModule
  ],
  controllers: [InitController],
  providers: [
    ConfigService,
    {
      provide: "DatabaseServiceInterface",
      useClass: DatabaseService
    }
  ],
  exports: [],
})
export class DatabaseModule { }
