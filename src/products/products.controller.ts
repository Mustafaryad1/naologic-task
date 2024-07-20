import { Controller, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Cron } from '@nestjs/schedule';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);
  constructor(private readonly productsService: ProductsService) {}

  @Cron('45 * * * * *')
  handleCron() {
    this.logger.verbose('Called when the current second is 45');
  }
}
