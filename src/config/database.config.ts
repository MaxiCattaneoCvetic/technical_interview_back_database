import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

import { Product } from 'src/module_data/models/product.entity';


config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Product],
  synchronize: false,
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false,
  logging: true,
}; 