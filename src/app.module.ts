import { Module } from '@nestjs/common';


import { DatabaseModule } from './module_data/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
