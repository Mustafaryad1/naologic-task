import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { BullModule } from '@nestjs/bullmq';
import { ProductsConsumer } from './products.consumer';

@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsConsumer],
})
export class ProductsModule {}
